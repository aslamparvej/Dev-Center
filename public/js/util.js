let menuBtnElements = document.querySelectorAll('.nav-link');

menuBtnElements.forEach(menuItem => {
    menuItem.addEventListener('click', function(){
        this.classList.add('active');
    });
});
