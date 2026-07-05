import QRCode from 'qrcode'
import { addDays } from 'date-fns'
import { prisma } from '../../lib/prisma'
import { supabase } from '../../lib/supabase'
import { pickTemplate, generateSiteContent } from '../../services/websiteGeneratorService'
import { getTemplateUrl } from '../../config/templates'
import { enqueueEmail } from '../queues'
import { isEmailEnabled } from '../../lib/email'
import type { WebsiteGenJobData } from '../queues'

export async function processWebsiteGenJob(data: WebsiteGenJobData): Promise<void> {
  const { businessId } = data

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: { presenceScore: true },
  })

  if (!business) {
    throw new Error(`Business ${businessId} not found`)
  }

  if (!business.presenceScore) {
    throw new Error(`No presence score found for business ${businessId}`)
  }

  const templateId = pickTemplate(business.category)
  const templateUrl = getTemplateUrl(templateId)

  const content = await generateSiteContent(business, business.presenceScore)

  const apiUrl = process.env.API_URL ?? 'http://localhost:4000'
  const trackingUrl = `${apiUrl}/s/${businessId}`

  const qrBuffer = await QRCode.toBuffer(trackingUrl, {
    type: 'png',
    width: 300,
    margin: 2,
  })

  const qrPath = `qr/${businessId}/qr.png`
  const { error: uploadError } = await supabase.storage
    .from('generated-sites')
    .upload(qrPath, qrBuffer, {
      contentType: 'image/png',
      upsert: true,
    })

  if (uploadError) {
    throw new Error(`Supabase QR upload failed: ${uploadError.message}`)
  }

  const { data: publicUrlData } = supabase.storage
    .from('generated-sites')
    .getPublicUrl(qrPath)

  const qrUrl = publicUrlData.publicUrl
  const siteUrl = `${templateUrl}/${businessId}`
  const expiryDays = parseInt(process.env.SITE_EXPIRY_DAYS ?? '7')
  const expiresAt = addDays(new Date(), expiryDays)

  await prisma.generatedWebsite.upsert({
    where: { businessId },
    create: {
      businessId,
      siteUrl,
      qrUrl,
      contentJson: content as object,
      templateId,
      templateUrl,
      expiresAt,
    },
    update: {
      siteUrl,
      qrUrl,
      contentJson: content as object,
      templateId,
      templateUrl,
      expiresAt,
      status: 'LIVE',
      deletedAt: null,
    },
  })

  if (business.email && isEmailEnabled()) {
    await enqueueEmail({ businessId, type: 'EMAIL' })
  }
}
