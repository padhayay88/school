<?php
$page_title = 'Manage Gallery';
include 'header.php';

$success = '';
$error = '';

// Handle gallery operations
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['action'])) {
        if ($_POST['action'] == 'add') {
            $event_name = mysqli_real_escape_string($conn, $_POST['event_name']);
            
            // Handle file upload
            if (isset($_FILES['gallery_image']) && $_FILES['gallery_image']['error'] == 0) {
                $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                $file_type = $_FILES['gallery_image']['type'];
                
                if (in_array($file_type, $allowed_types)) {
                    $file_name = time() . '_' . basename($_FILES['gallery_image']['name']);
                    $upload_path = '../uploads/gallery/' . $file_name;
                    
                    if (move_uploaded_file($_FILES['gallery_image']['tmp_name'], $upload_path)) {
                        $image_path = 'uploads/gallery/' . $file_name;
                        $query = "INSERT INTO gallery (event_name, image_name, image_path) 
                                  VALUES ('$event_name', '$file_name', '$image_path')";
                        
                        if (mysqli_query($conn, $query)) {
                            $success = "Image uploaded successfully!";
                        } else {
                            $error = "Error saving image to database.";
                        }
                    } else {
                        $error = "Error uploading file.";
                    }
                } else {
                    $error = "Only image files (JPEG, JPG, PNG, GIF) are allowed.";
                }
            } else {
                $error = "Please select an image to upload.";
            }
        } elseif ($_POST['action'] == 'delete') {
            $id = (int)$_POST['id'];
            
            // Get file path before deleting
            $image_data = mysqli_fetch_assoc(mysqli_query($conn, "SELECT image_path FROM gallery WHERE id=$id"));
            if ($image_data) {
                $file_path = '../' . $image_data['image_path'];
                if (file_exists($file_path)) {
                    unlink($file_path);
                }
            }
            
            $query = "UPDATE gallery SET is_active=0 WHERE id=$id";
            if (mysqli_query($conn, $query)) {
                $success = "Image deleted successfully!";
            } else {
                $error = "Error deleting image.";
            }
        }
    }
}

// Fetch all active gallery images
$gallery_query = "SELECT * FROM gallery WHERE is_active = 1 ORDER BY upload_date DESC";
$gallery_result = mysqli_query($conn, $gallery_query);

// Group by event
$images_by_event = [];
while ($image = mysqli_fetch_assoc($gallery_result)) {
    $images_by_event[$image['event_name']][] = $image;
}
?>

<h2 class="mb-4">
    <i class="fas fa-images me-2"></i>Manage Gallery
</h2>

<?php if ($success): ?>
    <div class="alert alert-success alert-dismissible fade show">
        <i class="fas fa-check-circle me-2"></i><?php echo $success; ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
<?php endif; ?>

<?php if ($error): ?>
    <div class="alert alert-danger alert-dismissible fade show">
        <i class="fas fa-exclamation-circle me-2"></i><?php echo $error; ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
<?php endif; ?>

<!-- Upload Image Form -->
<div class="card mb-4">
    <div class="card-header">
        <i class="fas fa-upload me-2"></i>Upload New Image
    </div>
    <div class="card-body">
        <form method="POST" action="" enctype="multipart/form-data">
            <input type="hidden" name="action" value="add">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="event_name" class="form-label">Event Name</label>
                    <input type="text" class="form-control" id="event_name" name="event_name" placeholder="e.g., Annual Function 2024" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="gallery_image" class="form-label">Image File</label>
                    <input type="file" class="form-control" id="gallery_image" name="gallery_image" accept="image/*" required>
                    <small class="text-muted">Supported: JPEG, JPG, PNG, GIF</small>
                </div>
            </div>
            <button type="submit" class="btn btn-primary">
                <i class="fas fa-upload me-2"></i>Upload Image
            </button>
        </form>
    </div>
</div>

<!-- Gallery Images -->
<div class="card">
    <div class="card-header">
        <i class="fas fa-list me-2"></i>Gallery Images
    </div>
    <div class="card-body">
        <?php if (!empty($images_by_event)): ?>
            <?php foreach ($images_by_event as $event_name => $event_images): ?>
                <div class="mb-4">
                    <h5 class="text-primary-custom mb-3">
                        <i class="fas fa-camera me-2"></i><?php echo htmlspecialchars($event_name); ?>
                    </h5>
                    <div class="row">
                        <?php foreach ($event_images as $image): ?>
                            <div class="col-md-3 col-sm-6 mb-3">
                                <div class="card">
                                    <img src="../<?php echo htmlspecialchars($image['image_path']); ?>" 
                                         class="card-img-top" 
                                         alt="<?php echo htmlspecialchars($event_name); ?>"
                                         style="height: 200px; object-fit: cover;">
                                    <div class="card-body p-2">
                                        <small class="text-muted d-block mb-2">
                                            <?php echo date('M d, Y', strtotime($image['upload_date'])); ?>
                                        </small>
                                        <button class="btn btn-sm btn-danger w-100" onclick="deleteImage(<?php echo $image['id']; ?>)">
                                            <i class="fas fa-trash me-1"></i>Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <p class="text-center text-muted">No images uploaded yet</p>
        <?php endif; ?>
    </div>
</div>

<!-- Delete Form (hidden) -->
<form id="deleteForm" method="POST" action="" style="display: none;">
    <input type="hidden" name="action" value="delete">
    <input type="hidden" name="id" id="delete_id">
</form>

<script>
function deleteImage(id) {
    if (confirm('Are you sure you want to delete this image? It will be permanently removed.')) {
        document.getElementById('delete_id').value = id;
        document.getElementById('deleteForm').submit();
    }
}
</script>

<?php include 'footer.php'; ?>
