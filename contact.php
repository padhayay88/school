<?php
$page_title = 'Contact Us';
include 'includes/header.php';
?>

<!-- Page Header -->
<section class="hero-section">
    <div class="container">
        <h1>Contact Us</h1>
        <p>Get in touch with us</p>
    </div>
</section>

<!-- Contact Information Section -->
<section class="section">
    <div class="container">
        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="card text-center h-100">
                    <div class="card-body">
                        <i class="fas fa-map-marker-alt fa-3x mb-3 text-primary-custom"></i>
                        <h5>Address</h5>
                        <p><?php echo !empty(SITE_ADDRESS) ? SITE_ADDRESS : 'Address will be updated by school administration'; ?></p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card text-center h-100">
                    <div class="card-body">
                        <i class="fas fa-phone fa-3x mb-3 text-primary-custom"></i>
                        <h5>Phone</h5>
                        <p><?php echo !empty(SITE_PHONE) ? SITE_PHONE : 'Phone will be updated by school administration'; ?></p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card text-center h-100">
                    <div class="card-body">
                        <i class="fas fa-envelope fa-3x mb-3 text-primary-custom"></i>
                        <h5>Email</h5>
                        <p><?php echo !empty(SITE_EMAIL) ? SITE_EMAIL : 'Email will be updated by school administration'; ?></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Map Section -->
<section class="section bg-light-custom">
    <div class="container">
        <div class="section-title">
            <h2>Location Map</h2>
        </div>
        <div class="card">
            <div class="card-body">
                <div class="empty-state">
                    <i class="fas fa-map-marked-alt fa-3x mb-3" style="color: #E0E0E0;"></i>
                    <p>Google Map embed will be added by school administration</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Office Hours Section -->
<section class="section">
    <div class="container">
        <div class="section-title">
            <h2>Office Hours</h2>
        </div>
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <div class="content-placeholder">
                            <i class="far fa-clock fa-3x mb-3" style="color: #E0E0E0;"></i>
                            <p>Content will be added by school administration</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
