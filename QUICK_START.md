# QUICK START GUIDE

## Installation Steps (5 Minutes)

### 1. Upload Files
- Upload all files to your web server
- Recommended location: `/public_html/school/` or `/www/school/`

### 2. Create Database
- Open phpMyAdmin
- Click "New" to create a database
- Name it: `school_website`
- Import the `database.sql` file

### 3. Configure Website
- Open `includes/config.php` in a text editor
- Update these lines:

```php
// Database settings (change if needed)
define('DB_HOST', 'localhost');
define('DB_USER', 'root');        // Your MySQL username
define('DB_PASS', '');            // Your MySQL password
define('DB_NAME', 'school_website');

// CHANGE THESE IMMEDIATELY!
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'admin123'); // Use a strong password!

// Update your school information
define('SITE_NAME', 'Your School Name Here');
define('SITE_EMAIL', 'contact@yourschool.com');
define('SITE_PHONE', '+1234567890');
define('SITE_ADDRESS', 'Your School Address');
```

### 4. Set Folder Permissions
Make upload folders writable:
- `uploads/` - 755
- `uploads/results/` - 755
- `uploads/gallery/` - 755
- `uploads/timetable/` - 755

### 5. Access Your Website
- **Public Website**: http://yourserver.com/school/
- **Admin Panel**: http://yourserver.com/school/admin/login.php

### 6. First Login
- Username: `admin`
- Password: `admin123` (or what you set in config.php)
- **CHANGE PASSWORD IMMEDIATELY** after first login!

## Admin Panel Quick Tour

### Dashboard
- See website statistics
- Quick links to all features

### Manage Notices
- Click "Add New Notice"
- Enter title, content, and date
- Click "Add Notice"
- Done! It will appear on the website

### Manage Results
- Click "Upload New Result"
- Select class from dropdown
- Enter exam name
- Upload PDF file
- Click "Upload Result"
- Students can now download it!

### Manage Gallery
- Click "Upload New Image"
- Enter event name
- Select image file
- Click "Upload Image"
- Image appears in gallery!

### View Inquiries
- See all admission inquiries
- Click "View" to see details
- Update status as you process them

## Common Tasks

### Adding a Notice
Admin → Manage Notices → Fill form → Add Notice

### Uploading Results
Admin → Manage Results → Select class → Upload PDF

### Adding Photos
Admin → Manage Gallery → Enter event → Upload image

### Checking Inquiries
Admin → Admission Inquiries → View all → Update status

## Need Help?

### File Upload Not Working?
- Check folder permissions (should be 755)
- Check PHP upload limit (increase if needed)

### Can't Login to Admin?
- Check username and password in config.php
- Clear browser cookies
- Ensure sessions are enabled in PHP

### Database Connection Error?
- Verify database credentials in config.php
- Ensure database exists
- Check if MySQL is running

## Important Security Tips

1. ✅ Change default admin password immediately
2. ✅ Use strong passwords
3. ✅ Take regular backups
4. ✅ Keep PHP and MySQL updated
5. ✅ Don't share admin credentials

## Backup Procedure

### Weekly Backup
1. Export database from phpMyAdmin
2. Download the `uploads/` folder
3. Save both in a safe location

### Before Updates
- Always backup before making changes
- Test changes on a copy first

## Support

For technical issues:
- Check README.md for detailed documentation
- Contact your web hosting support
- Consult with your web developer

---

**You're all set! Start adding your school's content through the admin panel.**
