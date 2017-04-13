var menuWrapper = document.getElementById("types-wrapper");
var menu = document.getElementById("types");
var menuWrapperClassList = menuWrapper.classList;
var backdrop = document.getElementById("types-backdrop");

backdrop.addEventListener('tap', toggleMenu);
document.getElementById("types-btn").addEventListener('tap', toggleMenu);
document.getElementById("icon-types").addEventListener('tap', toggleMenu)
	//下沉菜单中的点击事件
mui('#types').on('tap', 'a', function() {
	toggleMenu();
});
var busying = false;

function toggleMenu() {
	if(busying) {
		return;
	}
	busying = true;
	if(menuWrapperClassList.contains('mui-active')) {
		document.body.classList.remove('menu-open');
		menuWrapper.className = 'types-wrapper fade-out-up animated';
		menu.className = 'types bounce-out-up animated';
		setTimeout(function() {
			backdrop.style.opacity = 0;
			menuWrapper.classList.add('hidden');
		}, 500);
	} else {
		document.body.classList.add('menu-open');
		menuWrapper.className = 'types-wrapper fade-in-down animated mui-active';
		menu.className = 'types bounce-in-down animated';
		backdrop.style.opacity = 1;
	}
	setTimeout(function() {
		busying = false;
	}, 500);
}