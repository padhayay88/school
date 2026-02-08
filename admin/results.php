<?php
$page_title = 'Manage Results';
include 'header.php';

$success = '';
$error = '';

// Handle result upload
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['action'])) {
        if ($_POST['action'] == 'add') {
            $class_name = mysqli_real_escape_string($conn, $_POST['class_name']);
            $exam_name = mysqli_real_escape_string($conn, $_POST['exam_name']);
            
            // Handle file upload
            if (isset($_FILES['result_file']) && $_FILES['result_file']['error'] == 0) {
                $allowed_types = ['application/pdf'];
                $file_type = $_FILES['result_file']['type'];
                
                if (in_array($file_type, $allowed_types)) {
                    $file_name = time() . '_' . basename($_FILES['result_file']['name']);
                    $upload_path = '../uploads/results/' . $file_name;
                    
                    if (move_uploaded_file($_FILES['result_file']['tmp_name'], $upload_path)) {
                        $file_path = 'uploads/results/' . $file_name;
                        $query = "INSERT INTO results (class_name, exam_name, file_name, file_path) 
                                  VALUES ('$class_name', '$exam_name', '$file_name', '$file_path')";
                        
                        if (mysqli_query($conn, $query)) {
                            $success = "Result uploaded successfully!";
                        } else {
                            $error = "Error saving result to database.";
                        }
                    } else {
                        $error = "Error uploading file.";
                    }
                } else {
                    $error = "Only PDF files are allowed.";
                }
            } else {
                $error = "Please select a file to upload.";
            }
        } elseif ($_POST['action'] == 'delete') {
            $id = (int)$_POST['id'];
            
            // Get file path before deleting
            $result_data = mysqli_fetch_assoc(mysqli_query($conn, "SELECT file_path FROM results WHERE id=$id"));
            if ($result_data) {
                $file_path = '../' . $result_data['file_path'];
                if (file_exists($file_path)) {
                    unlink($file_path);
                }
            }
            
            $query = "UPDATE results SET is_active=0 WHERE id=$id";
            if (mysqli_query($conn, $query)) {
                $success = "Result deleted successfully!";
            } else {
                $error = "Error deleting result.";
            }
        }
    }
}

// Fetch all active results
$results_query = "SELECT * FROM results WHERE is_active = 1 ORDER BY upload_date DESC";
$results_result = mysqli_query($conn, $results_query);
?>

<h2 class="mb-4">
    <i class="fas fa-file-alt me-2"></i>Manage Results
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

<!-- Upload Result Form -->
<div class="card mb-4">
    <div class="card-header">
        <i class="fas fa-upload me-2"></i>Upload New Result
    </div>
    <div class="card-body">
        <form method="POST" action="" enctype="multipart/form-data">
            <input type="hidden" name="action" value="add">
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label for="class_name" class="form-label">Class</label>
                    <select class="form-control" id="class_name" name="class_name" required>
                        <option value="">Select Class</option>
                        <option value="Nursery">Nursery</option>
                        <option value="LKG">LKG</option>
                        <option value="UKG">UKG</option>
                        <option value="Class 1">Class 1</option>
                        <option value="Class 2">Class 2</option>
                        <option value="Class 3">Class 3</option>
                        <option value="Class 4">Class 4</option>
                        <option value="Class 5">Class 5</option>
                        <option value="Class 6">Class 6</option>
                        <option value="Class 7">Class 7</option>
                        <option value="Class 8">Class 8</option>
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10</option>
                        <option value="Class 11">Class 11</option>
                        <option value="Class 12">Class 12</option>
                    </select>
                </div>
                <div class="col-md-4 mb-3">
                    <label for="exam_name" class="form-label">Exam Name</label>
                    <input type="text" class="form-control" id="exam_name" name="exam_name" placeholder="e.g., First Term 2024" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label for="result_file" class="form-label">Result PDF File</label>
                    <input type="file" class="form-control" id="result_file" name="result_file" accept=".pdf" required>
                    <small class="text-muted">Only PDF files allowed</small>
                </div>
            </div>
            <button type="submit" class="btn btn-primary">
                <i class="fas fa-upload me-2"></i>Upload Result
            </button>
        </form>
    </div>
</div>

<!-- Existing Results -->
<div class="card">
    <div class="card-header">
        <i class="fas fa-list me-2"></i>Uploaded Results
    </div>
    <div class="card-body">
        <?php if (mysqli_num_rows($results_result) > 0): ?>
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Exam Name</th>
                            <th>File Name</th>
                            <th>Upload Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while ($result = mysqli_fetch_assoc($results_result)): ?>
                            <tr>
                                <td><strong><?php echo htmlspecialchars($result['class_name']); ?></strong></td>
                                <td><?php echo htmlspecialchars($result['exam_name']); ?></td>
                                <td>
                                    <i class="fas fa-file-pdf text-danger me-2"></i>
                                    <?php echo htmlspecialchars($result['file_name']); ?>
                                </td>
                                <td><?php echo date('M d, Y', strtotime($result['upload_date'])); ?></td>
                                <td>
                                    <a href="../<?php echo htmlspecialchars($result['file_path']); ?>" 
                                       class="btn btn-sm btn-primary" 
                                       target="_blank">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    <button class="btn btn-sm btn-danger" onclick="deleteResult(<?php echo $result['id']; ?>)">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            </div>
        <?php else: ?>
            <p class="text-center text-muted">No results uploaded yet</p>
        <?php endif; ?>
    </div>
</div>

<!-- Delete Form (hidden) -->
<form id="deleteForm" method="POST" action="" style="display: none;">
    <input type="hidden" name="action" value="delete">
    <input type="hidden" name="id" id="delete_id">
</form>

<script>
function deleteResult(id) {
    if (confirm('Are you sure you want to delete this result? The file will be permanently removed.')) {
        document.getElementById('delete_id').value = id;
        document.getElementById('deleteForm').submit();
    }
}
</script>

<?php include 'footer.php'; ?>
