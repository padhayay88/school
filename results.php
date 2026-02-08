<?php
$page_title = 'Results';
include 'includes/header.php';

// Fetch all active results grouped by class
$results_query = "SELECT * FROM results WHERE is_active = 1 ORDER BY class_name, upload_date DESC";
$results_result = mysqli_query($conn, $results_query);

// Group results by class
$results_by_class = [];
while ($result = mysqli_fetch_assoc($results_result)) {
    $results_by_class[$result['class_name']][] = $result;
}
?>

<!-- Page Header -->
<section class="hero-section">
    <div class="container">
        <h1>Examination Results</h1>
        <p>Download your results here</p>
    </div>
</section>

<!-- Results Section -->
<section class="section">
    <div class="container">
        <?php if (!empty($results_by_class)): ?>
            <?php foreach ($results_by_class as $class_name => $class_results): ?>
                <div class="mb-5">
                    <h3 class="text-primary-custom mb-4">
                        <i class="fas fa-graduation-cap me-2"></i><?php echo htmlspecialchars($class_name); ?>
                    </h3>
                    <div class="card">
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Exam Name</th>
                                            <th>Upload Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($class_results as $result): ?>
                                            <tr>
                                                <td>
                                                    <i class="fas fa-file-pdf text-danger me-2"></i>
                                                    <?php echo htmlspecialchars($result['exam_name']); ?>
                                                </td>
                                                <td>
                                                    <i class="far fa-calendar me-2"></i>
                                                    <?php echo date('F d, Y', strtotime($result['upload_date'])); ?>
                                                </td>
                                                <td>
                                                    <a href="<?php echo htmlspecialchars($result['file_path']); ?>" 
                                                       class="btn btn-sm btn-primary" 
                                                       target="_blank" 
                                                       download>
                                                        <i class="fas fa-download me-1"></i>Download
                                                    </a>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <p>Results will be published soon</p>
            </div>
        <?php endif; ?>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
