    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="row">
                <div class="col-md-4 mb-4">
                    <h5><i class="fas fa-school me-2"></i>About School</h5>
                    <p>Content will be added by school administration</p>
                </div>
                <div class="col-md-4 mb-4">
                    <h5><i class="fas fa-link me-2"></i>Quick Links</h5>
                    <ul class="list-unstyled">
                        <li><a href="index.php"><i class="fas fa-angle-right me-2"></i>Home</a></li>
                        <li><a href="about.php"><i class="fas fa-angle-right me-2"></i>About Us</a></li>
                        <li><a href="admissions.php"><i class="fas fa-angle-right me-2"></i>Admissions</a></li>
                        <li><a href="academics.php"><i class="fas fa-angle-right me-2"></i>Academics</a></li>
                        <li><a href="notices.php"><i class="fas fa-angle-right me-2"></i>Notice Board</a></li>
                        <li><a href="results.php"><i class="fas fa-angle-right me-2"></i>Results</a></li>
                    </ul>
                </div>
                <div class="col-md-4 mb-4">
                    <h5><i class="fas fa-address-book me-2"></i>Contact Info</h5>
                    <ul class="list-unstyled">
                        <li><i class="fas fa-map-marker-alt me-2"></i><?php echo !empty(SITE_ADDRESS) ? SITE_ADDRESS : 'Address will be updated'; ?></li>
                        <li><i class="fas fa-phone me-2"></i><?php echo !empty(SITE_PHONE) ? SITE_PHONE : 'Phone will be updated'; ?></li>
                        <li><i class="fas fa-envelope me-2"></i><?php echo !empty(SITE_EMAIL) ? SITE_EMAIL : 'Email will be updated'; ?></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; <?php echo date('Y'); ?> <?php echo SITE_NAME; ?>. All Rights Reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Custom JS -->
    <script src="js/main.js"></script>
</body>
</html>
