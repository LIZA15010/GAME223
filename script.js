
// весь скрипт — это одна большая функция
(function(){
	
	//  объявляем объект, внутри которого будет происходить основная механика игры
	var Memory = {

		// создаём карточку
		init: function(cards){
			//  получаем доступ к классам
			this.$game = $(".game");
			this.$modal = $(".modal");
			this.$overlay = $(".modal-overlay");
			this.$restartButton = $("button.restart");
			// собираем из карточек массив — игровое поле
			this.cardsArray = $.merge(cards, cards);
			// перемешиваем карточки
			this.shuffleCards(this.cardsArray);
			// и раскладываем их
			this.setup();
		},

		// как перемешиваются карточки
		shuffleCards: function(cardsArray){
			// используем встроенный метод .shuffle
			this.$cards = $(this.shuffle(this.cardsArray));
		},

		// раскладываем карты
		setup: function(){
			// подготавливаем код с карточками на страницу
			this.html = this.buildHTML();
			// добавляем код в блок с игрой
			this.$game.html(this.html);
			// получаем доступ к сформированным карточкам
			this.$memoryCards = $(".card");
			// на старте мы не ждём переворота второй карточки
			this.paused = false;
			// на старте у нас нет перевёрнутой первой карточки
     		this.guess = null;
     		// добавляем элементам на странице реакции на нажатия
			this.binding();
		},

		// как элементы будут реагировать на нажатия
		binding: function(){
			// обрабатываем нажатие на карточку
			this.$memoryCards.on("click", this.cardClicked);
			// и нажатие на кнопку перезапуска игры
			this.$restartButton.on("click", $.proxy(this.reset, this));
		},

		// что происходит при нажатии на карточку
		cardClicked: function(){
			// получаем текущее состояние родительской переменной
			var _ = Memory;
			// и получаем доступ к карточке, на которую нажали
			var $card = $(this);
			// если карточка уже не перевёрнута и мы не нажимаем на ту же самую карточку второй раз подряд
			if(!_.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")){
				// переворачиваем её
				$card.find(".inside").addClass("picked");
				// если мы перевернули первую карточку
				if(!_.guess){
					// то пока просто запоминаем её
					_.guess = $(this).attr("data-id");
				// если мы перевернули вторую и она совпадает с первой
				} else if(_.guess == $(this).attr("data-id") && !$(this).hasClass("picked")){
					// оставляем обе на поле перевёрнутыми и показываем анимацию совпадения
					$(".picked").addClass("matched");
					// обнуляем первую карточку
					_.guess = null;
						// если вторая не совпадает с первой
						} else {
							// обнуляем первую карточку
							_.guess = null;
							// не ждём переворота второй карточки
							_.paused = true;
							// ждём полсекунды и переворачиваем всё обратно
							setTimeout(function(){
								$(".picked").removeClass("picked");
								Memory.paused = false;
							}, 600);
						}
				// если мы перевернули все карточки
				if($(".matched").length == $(".card").length){
					// показываем победное сообщение
					_.win();
				}
			}
		},

		// показываем победное сообщение
		win: function(){
			// не ждём переворота карточек
			this.paused = true;
			// плавно показываем модальное окно с предложением сыграть ещё
			setTimeout(function(){
				Memory.showModal();
				Memory.$game.fadeOut();
			}, 1000);
		},

		// показываем модальное окно
		showModal: function(){
			// плавно делаем блок с сообщением видимым
			this.$overlay.show();
			this.$modal.fadeIn("slow");
		},

		// прячем модальное окно
		hideModal: function(){
			this.$overlay.hide();
			this.$modal.hide();
		},

		// перезапуск игры
		reset: function(){
			// прячем модальное окно с поздравлением
			this.hideModal();
			// перемешиваем карточки
			this.shuffleCards(this.cardsArray);
			// раскладываем их на поле
			this.setup();
			// показываем игровое поле
			this.$game.show("slow");
		},

		// Тасование Фишера–Йетса  перемешиваем карты
		shuffle: function(array){
			var counter = array.length, temp, index;
		   	while (counter > 0) {
	        	index = Math.floor(Math.random() * counter);
	        	counter--;
	        	temp = array[counter];
	        	array[counter] = array[index];
	        	array[index] = temp;
		    	}
		    return array;
		},

		// код, как добавляются карточки на страницу
		buildHTML: function(){
			// сюда будем складывать HTML-код
			var frag = '';
			// перебираем все карточки подряд
			this.$cards.each(function(k, v){
				// добавляем HTML-код для очередной карточки
				frag += '<div class="card" data-id="'+ v.id +'"><div class="inside">\
				<div class="front"><img src="'+ v.img +'"\
				alt="'+ v.name +'" /></div>\
				<div class="back"><img src="https://24gadget.ru/uploads/posts/2010-10/1287467190_eco-cliff-zoo.jpeg"\
				alt="Codepen" /></div></div>\
				</div>';
			});
			// возвращаем собранный код
			return frag;
		}
	};

	// карточки
	var cards = [
		{	
			// название
			name: "limur",
			// адрес картинки
			img: "https://img.freepik.com/free-photo/vertical-shot-of-cute-ring-tailed-lemurs-playing-on-a-tree-in-a-park_181624-44998.jpg",
			// порядковый номер пары
			id: 1,
		},
		{
			name: "enot",
			img: "https://s2.stc.all.kpcdn.net/family/wp-content/uploads/2022/12/top-ehkzoticheskie-zhivotnye-dlya-doma-960h540-960x540.jpg",
			
			id: 2
		},
		{
			name: "lev",
			img: "https://thumbs.dreamstime.com/z/%D0%B2%D0%B5%D1%80%D1%82%D0%B8%D0%BA%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9-%D1%81%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA-%D0%BB%D1%8C%D0%B2%D0%BE%D0%B2-%D0%B2-%D0%B7%D0%BE%D0%BE%D0%BF%D0%B0%D1%80%D0%BA%D0%B5-263377241.jpg",
			id: 3
		},
		{
			name: "zebra",
			img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUIWzyNfMALXI7TpYQHXojkJE7EMQadXykVA&s",
			id: 4
		}, 
		{
			name: "kot",
			img: "https://www.tury.ru/img.php?gid=93896&pid=380529&v=1200&webp=1",
			id: 5
		},
		{
			name: "medved",
			img: "https://img.freepik.com/free-photo/vertical-shot-of-a-grizzly-bear-walking-on-a-pathway-with-a-blurred-forest-in-the-background_181624-8554.jpg",
			id: 6
		},
		{
			name: "panda",
			img: "https://www.mos.ru/upload/newsfeed/articles/jqTqxfasefY(18).jpg",
			id: 7
		},
		{
			name: "makaka",
			img: "https://png.pngtree.com/thumb_back/fh260/background/20210915/pngtree-common-animal-photography-pictures-of-animals-in-the-zoo-image_887656.jpg",
			id: 8
		},
		{
			name: "bobr",
			img: "https://cs14.pikabu.ru/post_img/big/2023/10/31/10/1698772818125364623.jpg",
			id: 9
		},
		{
			name: "slon",
			img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaVtrEuZg0VuAj6UA8kQmukRod-FJ7XPfenA&s",
			id: 10
		},
		{
			name: "yasheritsa",
			img: "https://cs12.pikabu.ru/post_img/big/2019/04/07/11/1554663571173231607.jpg",
			id: 11
		},
		{
			name: "sobaka",
			img: "https://flomaster.top/o/uploads/posts/2024-02/1708761625_flomaster-top-p-lisaya-smeshnaya-sobaka-pinterest-risunok-1.jpg",
			id: 12
		},
	];
    
	// запускаем игру
	Memory.init(cards);


})();
