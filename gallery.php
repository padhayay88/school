<?php
$page_title = 'Gallery';
include 'includes/header.php';

// Fetch all active gallery images grouped by event
$gallery_query = "SELECT * FROM gallery WHERE is_active = 1 ORDER BY event_name, upload_date DESC";
$gallery_result = mysqli_query($conn, $gallery_query);

// Group images by event
$images_by_event = [];
while ($image = mysqli_fetch_assoc($gallery_result)) {
    $images_by_event[$image['event_name']][] = $image;
}
?>

<!-- Page Header -->
<section class="hero-section">
    <div class="container">
        <h1>Gallery</h1>
        <p>Moments captured from our school events</p>
    </div>
</section>

<!-- Gallery Section -->
<section class="section">
    <div class="container">
        <?php if (!empty($images_by_event)): ?>
            <?php foreach ($images_by_event as $event_name => $event_images): ?>
                <div class="mb-5">
                    <h3 class="text-primary-custom mb-4">
                        <i class="fas fa-camera me-2"></i><?php echo htmlspecialchars($event_name); ?>
                    </h3>
                    <div class="row">
                        <?php foreach ($event_images as $image): ?>
                            <div class="col-md-4 col-sm-6 mb-4">
                                <div class="gallery-item">
                                    <img src="<?php echo htmlspecialchars($image['image_path']); ?>" 
                                         alt="<?php echo htmlspecialchars($event_name); ?>" 
                                         class="img-fluid">
                                    <div class="gallery-overlay">
                                        <p class="mb-0"><?php echo date('F d, Y', strtotime($image['upload_date'])); ?></p>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="empty-state">
                <i class="far fa-images"></i>
                <p>Gallery images not uploaded yet</p>
            </div>
        <?php endif; ?>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
