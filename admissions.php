<?php
$page_title = 'Admissions';
include 'includes/header.php';

// Handle form submission
$success_message = '';
$error_message = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $student_name = mysqli_real_escape_string($conn, $_POST['student_name']);
    $parent_name = mysqli_real_escape_string($conn, $_POST['parent_name']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $phone = mysqli_real_escape_string($conn, $_POST['phone']);
    $class_applying = mysqli_real_escape_string($conn, $_POST['class_applying']);
    $message = mysqli_real_escape_string($conn, $_POST['message']);
    
    $insert_query = "INSERT INTO admission_inquiries (student_name, parent_name, email, phone, class_applying, message) 
                     VALUES ('$student_name', '$parent_name', '$email', '$phone', '$class_applying', '$message')";
    
    if (mysqli_query($conn, $insert_query)) {
        $success_message = "Your admission inquiry has been submitted successfully. We will contact you soon.";
    } else {
        $error_message = "Error submitting inquiry. Please try again.";
    }
}
?>

<!-- Page Header -->
<section class="hero-section">
    <div class="container">
        <h1>Admissions</h1>
        <p>Join our school community</p>
    </div>
</section>

<!-- Admission Information Section -->
<section class="section">
    <div class="container">
        <div class="section-title">
            <h2>Admission Information</h2>
        </div>
        <div class="content-area">
            <div class="content-placeholder">
                <i class="fas fa-info-circle fa-3x mb-3" style="color: #E0E0E0;"></i>
                <p>Content will be added by school administration</p>
            </div>
        </div>
    </div>
</section>

<!-- Admission Inquiry Form Section -->
<section class="section bg-light-custom">
    <div class="container">
        <div class="section-title">
            <h2>Admission Inquiry Form</h2>
            <p>Fill out the form below and we will get back to you</p>
        </div>
        
        <?php if ($success_message): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="fas fa-check-circle me-2"></i><?php echo $success_message; ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>
        
        <?php if ($error_message): ?>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i><?php echo $error_message; ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>
        
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-body p-4">
                        <form method="POST" action="" id="admissionForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="student_name" class="form-label">Student Name <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="student_name" name="student_name" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="parent_name" class="form-label">Parent/Guardian Name <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="parent_name" name="parent_name" required>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="email" class="form-label">Email Address <span class="text-danger">*</span></label>
                                    <input type="email" class="form-control" id="email" name="email" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="phone" class="form-label">Phone Number <span class="text-danger">*</span></label>
                                    <input type="tel" class="form-control" id="phone" name="phone" required>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="class_applying" class="form-label">Class Applying For <span class="text-danger">*</span></label>
                                <select class="form-control" id="class_applying" name="class_applying" required>
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
                            
                            <div class="mb-3">
                                <label for="message" class="form-label">Message/Query</label>
                                <textarea class="form-control" id="message" name="message" rows="4"></textarea>
                            </div>
                            
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-paper-plane me-2"></i>Submit Inquiry
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Admission Process Section -->
<section class="section">
    <div class="container">
        <div class="section-title">
            <h2>Admission Process</h2>
        </div>
        <div class="row">
            <div class="col-md-3 mb-4">
                <div class="card text-center h-100">
                    <div class="card-body">
                        <div class="mb-3">
                            <span class="badge bg-primary" style="font-size: 1.5rem; width: 50px; height: 50px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%;">1</span>
                        </div>
                        <h5>Inquiry</h5>
                        <p>Fill the admission inquiry form</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="card text-center h-100">
                    <div class="card-body">
                        <div class="mb-3">
                            <span class="badge bg-primary" style="font-size: 1.5rem; width: 50px; height: 50px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%;">2</span>
                        </div>
                        <h5>Application</h5>
                        <p>Submit application form</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="card text-center h-100">
                    <div class="card-body">
                        <div class="mb-3">
                            <span class="badge bg-primary" style="font-size: 1.5rem; width: 50px; height: 50px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%;">3</span>
                        </div>
                        <h5>Interview</h5>
                        <p>Attend interview</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="card text-center h-100">
                    <div class="card-body">
                        <div class="mb-3">
                            <span class="badge bg-primary" style="font-size: 1.5rem; width: 50px; height: 50px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%;">4</span>
                        </div>
                        <h5>Admission</h5>
                        <p>Complete admission formalities</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
