<?php
$page_title = 'Manage Notices';
include 'header.php';

$success = '';
$error = '';

// Handle notice operations
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['action'])) {
        if ($_POST['action'] == 'add') {
            $title = mysqli_real_escape_string($conn, $_POST['title']);
            $content = mysqli_real_escape_string($conn, $_POST['content']);
            $date_posted = mysqli_real_escape_string($conn, $_POST['date_posted']);
            
            $query = "INSERT INTO notices (title, content, date_posted) VALUES ('$title', '$content', '$date_posted')";
            if (mysqli_query($conn, $query)) {
                $success = "Notice added successfully!";
            } else {
                $error = "Error adding notice.";
            }
        } elseif ($_POST['action'] == 'edit') {
            $id = (int)$_POST['id'];
            $title = mysqli_real_escape_string($conn, $_POST['title']);
            $content = mysqli_real_escape_string($conn, $_POST['content']);
            $date_posted = mysqli_real_escape_string($conn, $_POST['date_posted']);
            
            $query = "UPDATE notices SET title='$title', content='$content', date_posted='$date_posted' WHERE id=$id";
            if (mysqli_query($conn, $query)) {
                $success = "Notice updated successfully!";
            } else {
                $error = "Error updating notice.";
            }
        } elseif ($_POST['action'] == 'delete') {
            $id = (int)$_POST['id'];
            $query = "UPDATE notices SET is_active=0 WHERE id=$id";
            if (mysqli_query($conn, $query)) {
                $success = "Notice deleted successfully!";
            } else {
                $error = "Error deleting notice.";
            }
        }
    }
}

// Fetch all active notices
$notices_query = "SELECT * FROM notices WHERE is_active = 1 ORDER BY date_posted DESC";
$notices_result = mysqli_query($conn, $notices_query);
?>

<h2 class="mb-4">
    <i class="fas fa-bullhorn me-2"></i>Manage Notices
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

<!-- Add Notice Form -->
<div class="card mb-4">
    <div class="card-header">
        <i class="fas fa-plus me-2"></i>Add New Notice
    </div>
    <div class="card-body">
        <form method="POST" action="">
            <input type="hidden" name="action" value="add">
            <div class="row">
                <div class="col-md-8 mb-3">
                    <label for="title" class="form-label">Notice Title</label>
                    <input type="text" class="form-control" id="title" name="title" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label for="date_posted" class="form-label">Date</label>
                    <input type="date" class="form-control" id="date_posted" name="date_posted" value="<?php echo date('Y-m-d'); ?>" required>
                </div>
            </div>
            <div class="mb-3">
                <label for="content" class="form-label">Notice Content</label>
                <textarea class="form-control" id="content" name="content" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">
                <i class="fas fa-save me-2"></i>Add Notice
            </button>
        </form>
    </div>
</div>

<!-- Existing Notices -->
<div class="card">
    <div class="card-header">
        <i class="fas fa-list me-2"></i>All Notices
    </div>
    <div class="card-body">
        <?php if (mysqli_num_rows($notices_result) > 0): ?>
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Title</th>
                            <th>Content Preview</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while ($notice = mysqli_fetch_assoc($notices_result)): ?>
                            <tr id="notice-<?php echo $notice['id']; ?>">
                                <td><?php echo date('M d, Y', strtotime($notice['date_posted'])); ?></td>
                                <td><strong><?php echo htmlspecialchars($notice['title']); ?></strong></td>
                                <td><?php echo htmlspecialchars(substr($notice['content'], 0, 100)); ?>...</td>
                                <td>
                                    <button class="btn btn-sm btn-primary" onclick="editNotice(<?php echo $notice['id']; ?>, '<?php echo addslashes(htmlspecialchars($notice['title'])); ?>', '<?php echo addslashes(htmlspecialchars($notice['content'])); ?>', '<?php echo date('Y-m-d', strtotime($notice['date_posted'])); ?>')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="deleteNotice(<?php echo $notice['id']; ?>)">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            </div>
        <?php else: ?>
            <p class="text-center text-muted">No notices available</p>
        <?php endif; ?>
    </div>
</div>

<!-- Edit Modal -->
<div class="modal fade" id="editModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Edit Notice</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form method="POST" action="">
                <input type="hidden" name="action" value="edit">
                <input type="hidden" name="id" id="edit_id">
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-8 mb-3">
                            <label for="edit_title" class="form-label">Notice Title</label>
                            <input type="text" class="form-control" id="edit_title" name="title" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="edit_date" class="form-label">Date</label>
                            <input type="date" class="form-control" id="edit_date" name="date_posted" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="edit_content" class="form-label">Notice Content</label>
                        <textarea class="form-control" id="edit_content" name="content" rows="5" required></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save me-2"></i>Update Notice
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Delete Form (hidden) -->
<form id="deleteForm" method="POST" action="" style="display: none;">
    <input type="hidden" name="action" value="delete">
    <input type="hidden" name="id" id="delete_id">
</form>

<script>
function editNotice(id, title, content, date) {
    document.getElementById('edit_id').value = id;
    document.getElementById('edit_title').value = title;
    document.getElementById('edit_content').value = content;
    document.getElementById('edit_date').value = date;
    new bootstrap.Modal(document.getElementById('editModal')).show();
}

function deleteNotice(id) {
    if (confirm('Are you sure you want to delete this notice?')) {
        document.getElementById('delete_id').value = id;
        document.getElementById('deleteForm').submit();
    }
}
</script>

<?php include 'footer.php'; ?>
