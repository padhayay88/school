<?php
$page_title = 'Admission Inquiries';
include 'header.php';

$success = '';
$error = '';

// Handle status update
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] == 'update_status') {
        $id = (int)$_POST['id'];
        $status = mysqli_real_escape_string($conn, $_POST['status']);
        
        $query = "UPDATE admission_inquiries SET status='$status' WHERE id=$id";
        if (mysqli_query($conn, $query)) {
            $success = "Status updated successfully!";
        } else {
            $error = "Error updating status.";
        }
    }
}

// Fetch all inquiries
$filter_status = isset($_GET['status']) ? $_GET['status'] : 'all';
$inquiries_query = "SELECT * FROM admission_inquiries";
if ($filter_status != 'all') {
    $inquiries_query .= " WHERE status='$filter_status'";
}
$inquiries_query .= " ORDER BY submission_date DESC";
$inquiries_result = mysqli_query($conn, $inquiries_query);

// Get counts
$new_count = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM admission_inquiries WHERE status='new'"))['count'];
$reviewed_count = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM admission_inquiries WHERE status='reviewed'"))['count'];
$contacted_count = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM admission_inquiries WHERE status='contacted'"))['count'];
$total_count = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM admission_inquiries"))['count'];
?>

<h2 class="mb-4">
    <i class="fas fa-user-graduate me-2"></i>Admission Inquiries
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

<!-- Filter Buttons -->
<div class="card mb-4">
    <div class="card-body">
        <div class="btn-group" role="group">
            <a href="?status=all" class="btn <?php echo ($filter_status == 'all') ? 'btn-primary' : 'btn-outline-primary'; ?>">
                All (<?php echo $total_count; ?>)
            </a>
            <a href="?status=new" class="btn <?php echo ($filter_status == 'new') ? 'btn-primary' : 'btn-outline-primary'; ?>">
                New (<?php echo $new_count; ?>)
            </a>
            <a href="?status=reviewed" class="btn <?php echo ($filter_status == 'reviewed') ? 'btn-primary' : 'btn-outline-primary'; ?>">
                Reviewed (<?php echo $reviewed_count; ?>)
            </a>
            <a href="?status=contacted" class="btn <?php echo ($filter_status == 'contacted') ? 'btn-primary' : 'btn-outline-primary'; ?>">
                Contacted (<?php echo $contacted_count; ?>)
            </a>
        </div>
    </div>
</div>

<!-- Inquiries List -->
<div class="card">
    <div class="card-header">
        <i class="fas fa-list me-2"></i>Inquiry List
    </div>
    <div class="card-body">
        <?php if (mysqli_num_rows($inquiries_result) > 0): ?>
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Student Name</th>
                            <th>Parent Name</th>
                            <th>Contact</th>
                            <th>Class</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while ($inquiry = mysqli_fetch_assoc($inquiries_result)): ?>
                            <tr>
                                <td><?php echo date('M d, Y', strtotime($inquiry['submission_date'])); ?></td>
                                <td><strong><?php echo htmlspecialchars($inquiry['student_name']); ?></strong></td>
                                <td><?php echo htmlspecialchars($inquiry['parent_name']); ?></td>
                                <td>
                                    <small>
                                        <i class="fas fa-phone me-1"></i><?php echo htmlspecialchars($inquiry['phone']); ?><br>
                                        <i class="fas fa-envelope me-1"></i><?php echo htmlspecialchars($inquiry['email']); ?>
                                    </small>
                                </td>
                                <td><?php echo htmlspecialchars($inquiry['class_applying']); ?></td>
                                <td>
                                    <?php
                                    $badge_class = 'secondary';
                                    if ($inquiry['status'] == 'new') $badge_class = 'danger';
                                    elseif ($inquiry['status'] == 'reviewed') $badge_class = 'warning';
                                    elseif ($inquiry['status'] == 'contacted') $badge_class = 'success';
                                    ?>
                                    <span class="badge bg-<?php echo $badge_class; ?>">
                                        <?php echo ucfirst($inquiry['status']); ?>
                                    </span>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-primary" onclick="viewInquiry(<?php echo $inquiry['id']; ?>, '<?php echo addslashes(htmlspecialchars($inquiry['student_name'])); ?>', '<?php echo addslashes(htmlspecialchars($inquiry['parent_name'])); ?>', '<?php echo addslashes(htmlspecialchars($inquiry['email'])); ?>', '<?php echo addslashes(htmlspecialchars($inquiry['phone'])); ?>', '<?php echo addslashes(htmlspecialchars($inquiry['class_applying'])); ?>', '<?php echo addslashes(htmlspecialchars($inquiry['message'])); ?>', '<?php echo $inquiry['status']; ?>')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            </div>
        <?php else: ?>
            <p class="text-center text-muted">No inquiries found</p>
        <?php endif; ?>
    </div>
</div>

<!-- View Modal -->
<div class="modal fade" id="viewModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Inquiry Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <strong>Student Name:</strong> <span id="view_student"></span>
                    </div>
                    <div class="col-md-6">
                        <strong>Parent/Guardian:</strong> <span id="view_parent"></span>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <strong>Email:</strong> <span id="view_email"></span>
                    </div>
                    <div class="col-md-6">
                        <strong>Phone:</strong> <span id="view_phone"></span>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-12">
                        <strong>Class Applying For:</strong> <span id="view_class"></span>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-12">
                        <strong>Message:</strong>
                        <p id="view_message" class="mt-2 p-3" style="background-color: #f8f9fa; border-radius: 5px;"></p>
                    </div>
                </div>
                <form method="POST" action="">
                    <input type="hidden" name="action" value="update_status">
                    <input type="hidden" name="id" id="inquiry_id">
                    <div class="row">
                        <div class="col-md-12">
                            <label class="form-label"><strong>Update Status:</strong></label>
                            <select class="form-control" name="status" id="inquiry_status">
                                <option value="new">New</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="contacted">Contacted</option>
                            </select>
                        </div>
                    </div>
                    <div class="text-end mt-3">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save me-2"></i>Update Status
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
function viewInquiry(id, student, parent, email, phone, classApplying, message, status) {
    document.getElementById('inquiry_id').value = id;
    document.getElementById('view_student').textContent = student;
    document.getElementById('view_parent').textContent = parent;
    document.getElementById('view_email').textContent = email;
    document.getElementById('view_phone').textContent = phone;
    document.getElementById('view_class').textContent = classApplying;
    document.getElementById('view_message').textContent = message || 'No message provided';
    document.getElementById('inquiry_status').value = status;
    new bootstrap.Modal(document.getElementById('viewModal')).show();
}
</script>

<?php include 'footer.php'; ?>
