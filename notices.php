<?php
$page_title = 'Notice Board';
include 'includes/header.php';

// Fetch all active notices
$notices_query = "SELECT * FROM notices WHERE is_active = 1 ORDER BY date_posted DESC";
$notices_result = mysqli_query($conn, $notices_query);
?>

<!-- Page Header -->
<section class="hero-section">
    <div class="container">
        <h1>Notice Board</h1>
        <p>Stay updated with latest announcements</p>
    </div>
</section>

<!-- Notices Section -->
<section class="section">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <?php if (mysqli_num_rows($notices_result) > 0): ?>
                    <?php while ($notice = mysqli_fetch_assoc($notices_result)): ?>
                        <div class="notice-item">
                            <div class="notice-date">
                                <i class="far fa-calendar-alt me-2"></i>
                                <?php echo date('F d, Y', strtotime($notice['date_posted'])); ?>
                                <?php 
                                $days_diff = (time() - strtotime($notice['date_posted'])) / (60 * 60 * 24);
                                if ($days_diff < 7): 
                                ?>
                                    <span class="badge-new ms-2">NEW</span>
                                <?php endif; ?>
                            </div>
                            <h5 class="notice-title"><?php echo htmlspecialchars($notice['title']); ?></h5>
                            <p class="mb-0"><?php echo nl2br(htmlspecialchars($notice['content'])); ?></p>
                        </div>
                    <?php endwhile; ?>
                <?php else: ?>
                    <div class="empty-state">
                        <i class="far fa-clipboard"></i>
                        <p>No notices available</p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
