# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image uploads in Easy Restaurant.

## Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account (or log in if you already have one)
3. Once logged in, you'll see your **Cloud Name** on the dashboard

## Step 2: Create an Upload Preset

1. In the Cloudinary dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure the preset:
   - **Preset name**: `menu_items` (or any name you prefer)
   - **Signing mode**: Select **Unsigned** (this allows uploads without API secret)
   - **Folder**: `menu-items` (optional, but recommended for organization)
   - **Upload manipulation**: You can add transformations here if needed
5. Click **Save**

## Step 3: Add Environment Variables

Add the following to your `.env.local` file:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name-here
CLOUDINARY_UPLOAD_PRESET=menu_items
```

Replace:
- `your-cloud-name-here` with your actual Cloudinary cloud name (found on dashboard)
- `menu_items` with your upload preset name if you used a different name

## Step 4: Verify Setup

1. Start your development server: `npm run dev`
2. Navigate to a menu item creation/edit page
3. Try uploading an image
4. The image should upload to Cloudinary and display a preview

## Troubleshooting

### Upload fails with "Invalid upload preset"
- Make sure the preset name in `.env.local` matches exactly
- Ensure the preset is set to **Unsigned** mode
- Check that the preset is active in Cloudinary dashboard

### Upload fails with "Invalid cloud name"
- Verify your cloud name is correct (no spaces or special characters)
- Make sure `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` starts with `NEXT_PUBLIC_` (required for client-side access)

### Images not displaying
- Check that the URL returned from Cloudinary is accessible
- Verify the image URL is being saved correctly in the database
- Check browser console for any CORS errors

## Cloudinary Free Tier Limits

The free tier includes:
- 25 GB storage
- 25 GB monthly bandwidth
- 25,000 monthly transformations

This should be sufficient for most small to medium restaurants.

## Security Notes

- The upload preset is set to **Unsigned** mode, which means anyone with the preset name can upload images
- For production, consider implementing additional security measures:
  - Use signed uploads with API secret
  - Implement rate limiting
  - Add file type and size validation (already implemented)
  - Use Cloudinary's moderation features for content filtering

