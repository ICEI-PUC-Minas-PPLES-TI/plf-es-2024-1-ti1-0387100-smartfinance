document.addEventListener("DOMContentLoaded", function() {
  let sidebar = document.querySelector(".sidebar");
  let closeBtn = document.querySelector("#btn");
  let homeLink = document.querySelector("#home-link");
  let navList = document.querySelector(".nav-list");

  closeBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      menuBtnChange();
      toggleHomeLink();
      toggleNavList();
      toggleBtnCenter();
  });

  homeLink.addEventListener("click", (e) => {
    if (!sidebar.classList.contains("open")) {
      e.preventDefault(); 
    } else {
      sidebar.classList.add("open");
      menuBtnChange();
    }
  });

  function toggleHomeLink() {
    if (sidebar.classList.contains("open")) {
      homeLink.classList.remove("disabled-link");
    } else {
      homeLink.classList.add("disabled-link");
    }
  }

  function toggleNavList() {
    if (sidebar.classList.contains("open")) {
      navList.classList.remove("hide");
    } else {
      navList.classList.add("hide");
    }
  }

  function toggleBtnCenter() {
    if (window.innerWidth <= 420) {
      if (sidebar.classList.contains("open")) {
        closeBtn.classList.remove("center");
      } else {
        closeBtn.classList.add("center");
      }
    } else {
      closeBtn.classList.remove("center");
    }
  }

  toggleHomeLink();
  toggleNavList();
  toggleBtnCenter();

  function menuBtnChange() {
      if (sidebar.classList.contains("open")) {
          closeBtn.classList.replace("bx-menu", "bx-menu-alt-right"); 
      } else {
          closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
      }
  }

  window.addEventListener('resize', toggleBtnCenter);
});
