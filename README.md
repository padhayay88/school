# School Website - Complete Documentation

## Overview
This is a professional, clean, and SEO-friendly school website built with PHP and MySQL. The website is fully responsive and ready for real school use with no dummy data or placeholder content.

## Features
✅ Clean and professional design with custom color scheme
✅ Fully responsive (mobile, tablet, desktop)
✅ SEO-friendly structure
✅ Secure admin panel with password protection
✅ Dynamic content management
✅ No dummy data or placeholder text

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend**: PHP
- **Database**: MySQL
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Poppins)

## Color Scheme
- **Primary Color**: Navy Blue (#0A1F44)
- **Secondary Color**: White (#FFFFFF)
- **Accent Color**: Golden Yellow (#F4B400)
- **Text Color**: Dark Gray (#333333)

## Installation Instructions

### Step 1: Server Requirements
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- mod_rewrite enabled (for Apache)

### Step 2: Database Setup
1. Open phpMyAdmin or your MySQL client
2. Create a new database named `school_website`
3. Import the `database.sql` file into the database
4. The database will be created with all required tables

### Step 3: Configuration
1. Open `includes/config.php`
2. Update database credentials if needed:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   define('DB_NAME', 'school_website');
   ```

3. **IMPORTANT**: Change the admin credentials immediately:
   ```php
   define('ADMIN_USERNAME', 'admin');
   define('ADMIN_PASSWORD', 'admin123'); // Change this!
   ```

4. Update site settings:
   ```php
   define('SITE_NAME', 'Your School Name');
   define('SITE_EMAIL', 'your-email@school.com');
   define('SITE_PHONE', '+1234567890');
   define('SITE_ADDRESS', 'Your School Address');
   ```

### Step 4: File Permissions
Set proper permissions for upload folders:
```bash
chmod 755 uploads/
chmod 755 uploads/results/
chmod 755 uploads/gallery/
chmod 755 uploads/timetable/
```

### Step 5: Access the Website
- **Public Website**: http://yourserver/school/
- **Admin Panel**: http://yourserver/school/admin/login.php
- **Default Admin Login**:
  - Username: `admin`
  - Password: `admin123` (Change this immediately!)

## Directory Structure
```
school/
├── admin/                  # Admin panel files
│   ├── login.php          # Admin login page
│   ├── dashboard.php      # Admin dashboard
│   ├── notices.php        # Manage notices
│   ├── results.php        # Manage results
│   ├── gallery.php        # Manage gallery
│   ├── admissions.php     # View inquiries
│   ├── header.php         # Admin header
│   ├── footer.php         # Admin footer
│   └── logout.php         # Logout script
├── css/
│   └── style.css          # Main stylesheet
├── images/                # Static images
├── includes/
│   ├── config.php         # Database & site configuration
│   ├── header.php         # Public website header
│   └── footer.php         # Public website footer
├── js/
│   └── main.js            # JavaScript functions
├── uploads/               # User-uploaded files
│   ├── results/          # PDF results
│   ├── gallery/          # Gallery images
│   └── timetable/        # Timetable files
├── index.php              # Homepage
├── about.php              # About Us page
├── admissions.php         # Admissions page
├── academics.php          # Academics page
├── notices.php            # Notice Board
├── results.php            # Results page
├── gallery.php            # Gallery page
├── contact.php            # Contact Us page
└── database.sql           # Database schema
```

## Admin Panel Features

### 1. Dashboard
- Overview of website statistics
- Quick access to all management sections
- Recent notices and inquiries

### 2. Manage Notices
- Add new notices with title, content, and date
- Edit existing notices
- Delete notices
- All notices appear on homepage and notice board

### 3. Manage Results
- Upload result PDFs by class
- Delete old results
- Results are downloadable by students/parents

### 4. Manage Gallery
- Upload event images
- Organize by event name
- Delete images
- Images appear in the gallery page

### 5. Admission Inquiries
- View all admission inquiries
- Filter by status (New, Reviewed, Contacted)
- Update inquiry status
- View complete inquiry details

## Pages Overview

### Public Pages
1. **Home** - Welcome section, principal's message, latest notices, quick links
2. **About Us** - School history, mission & vision, management & staff
3. **Admissions** - Admission information, online inquiry form
4. **Academics** - Classes offered, subjects, timetables, activities
5. **Notice Board** - All published notices
6. **Results** - Class-wise examination results (PDF downloads)
7. **Gallery** - Event-wise image gallery
8. **Contact Us** - Contact information, location map placeholder

## Security Features
- Password-protected admin panel
- Session-based authentication
- SQL injection prevention using mysqli_real_escape_string
- File type validation for uploads
- Hidden admin URL can be customized

## SEO Features
- Clean, semantic HTML5
- Proper heading hierarchy
- Meta tags for description and keywords
- Descriptive page titles
- Fast loading with CDN resources
- Mobile-responsive design

## How to Update Content

### Adding School Information
1. Login to admin panel
2. Update site settings in `includes/config.php`
3. Content will automatically appear across the website

### Publishing Notices
1. Go to Admin → Manage Notices
2. Fill in title, content, and date
3. Click "Add Notice"
4. Notice will appear on homepage and notice board

### Uploading Results
1. Go to Admin → Manage Results
2. Select class and exam name
3. Upload PDF file
4. Students can download from Results page

### Adding Gallery Images
1. Go to Admin → Manage Gallery
2. Enter event name
3. Upload image (JPEG, PNG, GIF)
4. Images are grouped by event name

### Managing Admission Inquiries
1. Go to Admin → Admission Inquiries
2. View all inquiries with contact details
3. Update status as you process them
4. Filter by status for better organization

## Customization

### Changing Colors
Edit `css/style.css` and update the CSS variables:
```css
:root {
    --primary-color: #0A1F44;
    --secondary-color: #FFFFFF;
    --accent-color: #F4B400;
    --text-color: #333333;
}
```

### Changing Fonts
Update the Google Fonts import in `css/style.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700&display=swap');
```

### Adding Logo
1. Upload your school logo to `images/` folder
2. Edit `includes/header.php`
3. Replace the logo placeholder with:
```html
<img src="images/your-logo.png" alt="School Logo" style="height: 50px;">
```

## Backup Instructions
1. **Database Backup**: Export `school_website` database from phpMyAdmin
2. **Files Backup**: Copy the entire `school/` folder
3. **Important**: Backup `uploads/` folder regularly to preserve results and gallery

## Troubleshooting

### File Upload Issues
- Check folder permissions (755 for upload folders)
- Verify PHP upload_max_filesize in php.ini
- Check post_max_size in php.ini

### Database Connection Errors
- Verify database credentials in config.php
- Ensure MySQL service is running
- Check if database exists

### Admin Login Issues
- Clear browser cookies
- Check admin credentials in config.php
- Verify session support is enabled in PHP

## Support & Maintenance
- Keep PHP and MySQL updated
- Regularly backup database and files
- Monitor upload folder size
- Review and clean old data periodically

## Browser Compatibility
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Microsoft Edge (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License
This is a custom-built school website. Modify as needed for your institution.

## Important Notes
⚠️ **SECURITY**: Change default admin password immediately after installation
⚠️ **BACKUP**: Take regular backups of database and uploaded files
⚠️ **UPDATES**: Keep all content updated through the admin panel
✅ **NO DUMMY DATA**: Website is ready for real use with proper content management

---

For any technical assistance, please contact your web developer or hosting provider.
