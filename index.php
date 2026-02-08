<?php
$page_title = 'Home';
include 'includes/header.php';

// Fetch latest notices
$notices_query = "SELECT * FROM notices WHERE is_active = 1 ORDER BY date_posted DESC LIMIT 5";
$notices_result = mysqli_query($conn, $notices_query);
?>

<!-- Hero Section -->
<section class="hero-section">
    <div class="container">
        <h1>Welcome to <?php echo SITE_NAME; ?></h1>
        <p>Content will be added by school administration</p>
    </div>
</section>

<!-- School Introduction Section -->
<section class="section bg-light-custom">
    <div class="container">
        <div class="section-title">
            <h2>About Our School</h2>
        </div>
        <div class="content-area">
            <div class="content-placeholder">
                <i class="fas fa-school fa-3x mb-3" style="color: #E0E0E0;"></i>
                <p>Content will be added by school administration</p>
            </div>
        </div>
    </div>
</section>

<!-- Principal's Message Section -->
<section class="section">
    <div class="container">
        <div class="section-title">
            <h2>Principal's Message</h2>
        </div>
        <div class="content-area">
            <div class="content-placeholder">
                <i class="fas fa-user-tie fa-3x mb-3" style="color: #E0E0E0;"></i>
                <p>Content will be added by school administration</p>
            </div>
        </div>
    </div>
</section>

<!-- Highlights Section -->
<section class="section bg-light-custom">
    <div class="container">
        <div class="section-title">
            <h2>Our Highlights</h2>
        </div>
        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="card text-center">
                    <div class="card-body">
                        <i class="fas fa-trophy fa-3x mb-3 text-accent"></i>
                        <h5>Achievements</h5>
                        <p>Content will be added by school administration</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card text-center">
                    <div class="card-body">
                        <i class="fas fa-chalkboard-teacher fa-3x mb-3 text-accent"></i>
                        <h5>Quality Education</h5>
                        <p>Content will be added by school administration</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card text-center">
                    <div class="card-body">
                        <i class="fas fa-users fa-3x mb-3 text-accent"></i>
                        <h5>Experienced Faculty</h5>
                        <p>Content will be added by school administration</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Latest Notices Section -->
<section class="section">
    <div class="container">
        <div class="section-title">
            <h2>Latest Notices</h2>
        </div>
        <div class="row">
            <div class="col-md-12">
                <?php if (mysqli_num_rows($notices_result) > 0): ?>
                    <?php while ($notice = mysqli_fetch_assoc($notices_result)): ?>
                        <div class="notice-item">
                            <div class="notice-date">
                                <i class="far fa-calendar-alt me-2"></i>
                                <?php echo date('F d, Y', strtotime($notice['date_posted'])); ?>
                            </div>
                            <h5 class="notice-title"><?php echo htmlspecialchars($notice['title']); ?></h5>
                            <p class="mb-0"><?php echo nl2br(htmlspecialchars(substr($notice['content'], 0, 200))); ?>...</p>
                        </div>
                    <?php endwhile; ?>
                    <div class="text-center mt-4">
                        <a href="notices.php" class="btn btn-primary">View All Notices</a>
                    </div>
                <?php else: ?>
                    <div class="empty-state">
                        <i class="far fa-clipboard"></i>
                        <p>No notices published yet</p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>

<!-- Quick Links Section -->
<section class="section bg-light-custom">
    <div class="container">
        <div class="section-title">
            <h2>Quick Links</h2>
        </div>
        <div class="row">
            <div class="col-md-3 col-sm-6 mb-4">
                <a href="admissions.php" class="text-decoration-none">
                    <div class="card text-center h-100">
                        <div class="card-body">
                            <i class="fas fa-user-graduate fa-3x mb-3 text-primary-custom"></i>
                            <h5>Admissions</h5>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-3 col-sm-6 mb-4">
                <a href="academics.php" class="text-decoration-none">
                    <div class="card text-center h-100">
                        <div class="card-body">
                            <i class="fas fa-book-open fa-3x mb-3 text-primary-custom"></i>
                            <h5>Academics</h5>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-3 col-sm-6 mb-4">
                <a href="results.php" class="text-decoration-none">
                    <div class="card text-center h-100">
                        <div class="card-body">
                            <i class="fas fa-chart-line fa-3x mb-3 text-primary-custom"></i>
                            <h5>Results</h5>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-3 col-sm-6 mb-4">
                <a href="gallery.php" class="text-decoration-none">
                    <div class="card text-center h-100">
                        <div class="card-body">
                            <i class="fas fa-images fa-3x mb-3 text-primary-custom"></i>
                            <h5>Gallery</h5>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
