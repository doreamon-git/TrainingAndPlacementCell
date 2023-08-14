const notificationDropdown = document.querySelector('#notificationDropdown');
const notificationList = document.querySelector('#notificationArea');


notificationDropdown.addEventListener('click', async () => {
  notificationList.innerHTML = '';
  document.querySelector('.notification-count').textContent = 0;
  const studentNotifications = await axios.get('/notification');
  console.log(studentNotifications.data.notifications);

  studentNotifications.data.notifications.forEach(oneNotification => {
    const listItem = document.createElement('li');
    listItem.classList.add('dropdown-item');
    listItem.classList.add('notification-item');
    if (oneNotification.seen == false) {
      listItem.style.backgroundColor = '#FFFCDF';
    }

    const notificationContent = document.createElement('div');
    notificationContent.classList.add('notification-content');

    const icon = document.createElement('i');
    if(oneNotification.notification.type == 'hiring'){ icon.classList.add('fa', 'fa-briefcase', 'fa-lg', 'mx-3');}
    else if(oneNotification.notification.type == 'round result'){ icon.classList.add('fa', 'fa-check-circle', 'fa-lg', 'text-warning' ,'mx-3');}
    else if(oneNotification.notification.type == 'final round result'){ icon.classList.add('fa', 'fa-flag', 'fa-lg', 'text-success', 'mx-3');}

    notificationContent.appendChild(icon);

    const notificationText = document.createElement('span');
    notificationText.innerHTML = oneNotification.notification.content;
    notificationContent.appendChild(notificationText);

    const notificationTime = document.createElement('span');
    notificationTime.classList.add('notification-time', 'mx-5');
    notificationTime.textContent = oneNotification.notification.date;

   
    listItem.appendChild(notificationContent);
    listItem.appendChild(notificationTime);
    

    notificationList.appendChild(listItem);
  });

  if (document.querySelector('.notification-count').textContent == 0) {
    document.querySelector('.notification-count').style.display = 'none';
  }
});

if (document.querySelector('.notification-count').textContent == 0) {
  document.querySelector('.notification-count').style.display = 'none';
}

const bellIcon = document.querySelector('#bellIcon');
notificationDropdown.addEventListener('click', function () {
  bellIcon.parentElement.classList.toggle('active');
});

document.addEventListener('click', function (event) {
  const target = event.target;
  if (!notificationDropdown.contains(target)) {
    bellIcon.parentElement.classList.remove('active');
  }
});


document.addEventListener('DOMContentLoaded', function () {
  var links = document.querySelectorAll('.navBar .nav-link');

  console.log(links)

  for (var i = 0; i < links.length; i++) {
    if (window.location.href.includes(links[i].href)) {
      console.log(window.location.href)
      console.log(links[i].href)
      links[i].classList.add('active');
    }
  }
});