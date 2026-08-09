# Profile images

## Upload from the UI (recommended)

1. Open the frontend profile page.
2. Click **Edit Profile**.
3. Click the placeholder / profile picture.
4. Choose a JPEG, PNG, or WebP file (max 5 MB).
5. Click **Update Profile** when finished with other fields.

The backend saves it here as `profile.jpg`, `profile.png`, or `profile.webp`.

## Manual file drop

You can also copy a photo into this folder as:

- `profile.jpg` (preferred)
- `profile.jpeg`
- `profile.png`
- `profile.webp`

Then restart the backend if needed and hard-refresh the browser.

If none of those files exist, the API serves `placeholder.svg`, and the UI shows an initials placeholder with “Click to upload photo”.
