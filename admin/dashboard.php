<?php
$page_title = 'Dashboard';
include 'header.php';

// Get statistics
$notices_count = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM notices WHERE is_active = 1"))['count'];
$results_count = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM results WHERE is_active = 1"))['count'];
$gallery_count = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM gallery WHERE is_active = 1"))['count'];
$inquiries_count = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM admission_inquiries WHERE status = 'new'"))['count'];
?>

<h2 class="mb-4">
    <i class="fas fa-tachometer-alt me-2"></i>Dashboard
</h2>

<!-- Statistics Cards -->
<div class="row mb-4">
    <div class="col-md-3 mb-3">
        <div class="card text-white" style="background-color: var(--primary-color);">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0">Active Notices</h6>
                        <h2 class="mb-0"><?php echo $notices_count; ?></h2>
                    </div>
                    <i class="fas fa-bullhorn fa-3x" style="opacity: 0.3;"></i>
                </div>
            </div>
            <div class="card-footer">
                <a href="notices.php" class="text-white text-decoration-none">
                    <small>Manage Notices <i class="fas fa-arrow-right"></i></small>
                </a>
            </div>
        </div>
    </div>
    
    <div class="col-md-3 mb-3">
        <div class="card text-white" style="background-color: #28a745;">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0">Results</h6>
                        <h2 class="mb-0"><?php echo $results_count; ?></h2>
                    </div>
                    <i class="fas fa-file-alt fa-3x" style="opacity: 0.3;"></i>
                </div>
            </div>
            <div class="card-footer">
                <a href="results.php" class="text-white text-decoration-none">
                    <small>Manage Results <i class="fas fa-arrow-right"></i></small>
                </a>
            </div>
        </div>
    </div>
    
    <div class="col-md-3 mb-3">
        <div class="card text-white" style="background-color: #ffc107; color: #333 !important;">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0 text-dark">Gallery Images</h6>
                        <h2 class="mb-0 text-dark"><?php echo $gallery_count; ?></h2>
                    </div>
                    <i class="fas fa-images fa-3x text-dark" style="opacity: 0.3;"></i>
                </div>
            </div>
            <div class="card-footer">
                <a href="gallery.php" class="text-dark text-decoration-none">
                    <small>Manage Gallery <i class="fas fa-arrow-right"></i></small>
                </a>
            </div>
        </div>
    </div>
    
    <div class="col-md-3 mb-3">
        <div class="card text-white" style="background-color: #dc3545;">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0">New Inquiries</h6>
                        <h2 class="mb-0"><?php echo $inquiries_count; ?></h2>
                    </div>
                    <i class="fas fa-user-graduate fa-3x" style="opacity: 0.3;"></i>
                </div>
            </div>
            <div class="card-footer">
                <a href="admissions.php" class="text-white text-decoration-none">
                    <small>View Inquiries <i class="fas fa-arrow-right"></i></small>
                </a>
            </div>
        </div>
    </div>
</div>

<!-- Recent Activity -->
<div class="row">
    <div class="col-md-6 mb-4">
        <div class="card">
            <div class="card-header">
                <i class="fas fa-bullhorn me-2"></i>Recent Notices
            </div>
            <div class="card-body">
                <?php
                $recent_notices = mysqli_query($conn, "SELECT * FROM notices WHERE is_active = 1 ORDER BY date_posted DESC LIMIT 5");
                if (mysqli_num_rows($recent_notices) > 0):
                ?>
                    <ul class="list-group list-group-flush">
                        <?php while ($notice = mysqli_fetch_assoc($recent_notices)): ?>
                            <li class="list-group-item">
                                <strong><?php echo htmlspecialchars($notice['title']); ?></strong>
                                <small class="text-muted d-block"><?php echo date('M d, Y', strtotime($notice['date_posted'])); ?></small>
                            </li>
                        <?php endwhile; ?>
                    </ul>
                <?php else: ?>
                    <p class="text-muted text-center">No notices yet</p>
                <?php endif; ?>
            </div>
        </div>
    </div>
    
    <div class="col-md-6 mb-4">
        <div class="card">
            <div class="card-header">
                <i class="fas fa-user-graduate me-2"></i>Recent Inquiries
            </div>
            <div class="card-body">
                <?php
                $recent_inquiries = mysqli_query($conn, "SELECT * FROM admission_inquiries ORDER BY submission_date DESC LIMIT 5");
                if (mysqli_num_rows($recent_inquiries) > 0):
                ?>
                    <ul class="list-group list-group-flush">
                        <?php while ($inquiry = mysqli_fetch_assoc($recent_inquiries)): ?>
                            <li class="list-group-item">
                                <strong><?php echo htmlspecialchars($inquiry['student_name']); ?></strong> - <?php echo htmlspecialchars($inquiry['class_applying']); ?>
                                <small class="text-muted d-block"><?php echo date('M d, Y', strtotime($inquiry['submission_date'])); ?></small>
                            </li>
                        <?php endwhile; ?>
                    </ul>
                <?php else: ?>
                    <p class="text-muted text-center">No inquiries yet</p>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<!-- Quick Actions -->
<div class="row">
    <div class="col-md-12">
        <div class="card">
            <div class="card-header">
                <i class="fas fa-bolt me-2"></i>Quick Actions
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3 mb-2">
                        <a href="notices.php" class="btn btn-primary w-100">
                            <i class="fas fa-plus me-2"></i>Add Notice
                        </a>
                    </div>
                    <div class="col-md-3 mb-2">
                        <a href="results.php" class="btn btn-success w-100">
                            <i class="fas fa-upload me-2"></i>Upload Result
                        </a>
                    </div>
                    <div class="col-md-3 mb-2">
                        <a href="gallery.php" class="btn btn-warning w-100">
                            <i class="fas fa-image me-2"></i>Add Gallery Image
                        </a>
                    </div>
                    <div class="col-md-3 mb-2">
                        <a href="admissions.php" class="btn btn-danger w-100">
                            <i class="fas fa-inbox me-2"></i>View Inquiries
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include 'footer.php'; ?>
