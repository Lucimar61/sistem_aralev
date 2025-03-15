document.querySelector('.bi-eye-fill').addEventListener('click', function() {
    const passwordField = document.querySelector('input[name="senha_usuario"]');
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      this.classList.remove('bi-eye-fill');
      this.classList.add('bi-eye-slash-fill');
    } else {
      passwordField.type = 'password';
      this.classList.remove('bi-eye-slash-fill');
      this.classList.add('bi-eye-fill');
    }
  });
  