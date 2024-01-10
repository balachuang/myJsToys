const imgItems = [
	{ url: 'Images/Ocean.png',     w: 1920, h: 1080, desc: 'Ocean Surface' },
	{ url: 'Images/Toilet.png',    w: 1920, h: 1080, desc: 'Toilet'        },
	{ url: 'Images/SunnyRoom.png', w: 1600, h: 1200, desc: 'Sunny Room'    },
	{ url: 'Images/Mahjong.png',   w: 1920, h: 1080, desc: 'Mahjong'       },
	{ url: 'Images/3Cups.png',     w: 1920, h: 1080, desc: 'Three Cups'    },
	{ url: 'Images/SnowMan.png',   w: 1920, h: 1080, desc: 'Snow Man'      }
];

const imgHtml = '<a href="{url}" data-pswp-width="{w}" data-pswp-height="{h}" target="_blank"> <img class="thumb-image" src="{url}" alt="{desc}" /></a>';

for (var i=0; i<imgItems.length; ++i) {
	var thisImg = imgHtml
		.replaceAll('{url}', imgItems[i].url)
		.replaceAll('{w}', imgItems[i].w)
		.replaceAll('{h}', imgItems[i].h)
		.replaceAll('{desc}', imgItems[i].desc);
	$('#my-3d-gallery').append(thisImg);
}


import PhotoSwipeLightbox from './PhotoSwipe_v5_core/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#my-3d-gallery',
  children: 'a',
  pswpModule: () => import('./PhotoSwipe_v5_core/photoswipe.esm.js')
});
lightbox.init();
