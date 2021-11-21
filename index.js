 // полифилл CustomEven для IE11
    (function () {
      if (typeof window.CustomEvent === "function") return false;
      function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      }
      window.CustomEvent = CustomEvent;
    })();

    $modal = function (options) {
      var
        _elemModal,
        _eventShowModal,
        _eventHideModal,
        _hiding = false,
        _destroyed = false,
        _animationSpeed = 200;

      function _createModal(options) {
        var
          elemModal = document.createElement('div'),
          modalTemplate = '<div class="modal__backdrop" data-dismiss="modal"><div class="modal__content"><div class="modal__header"><div class="modal__title" data-modal="title">{{title}}</div><span class="modal__btn-close" data-dismiss="modal" title="Закрыть">×</span></div><div class="modal__body" data-modal="content">{{content}}</div>{{footer}}</div></div>',
          modalFooterTemplate = '<div class="modal__footer">{{buttons}}</div>',
          modalButtonTemplate = '<button type="button" class="{{button_class}}" data-handler={{button_handler}}>{{button_text}}</button>',
          modalHTML,
          modalFooterHTML = '';

        elemModal.classList.add('modal');
        modalHTML = modalTemplate.replace('{{title}}', options.title || '');
        modalHTML = modalHTML.replace('{{content}}', options.content || '');
        if (options.footerButtons) {
          for (var i = 0, length = options.footerButtons.length; i < length; i++) {
            var modalFooterButton = modalButtonTemplate.replace('{{button_class}}', options.footerButtons[i].class);
            modalFooterButton = modalFooterButton.replace('{{button_handler}}', options.footerButtons[i].handler);
            modalFooterButton = modalFooterButton.replace('{{button_text}}', options.footerButtons[i].text);
            modalFooterHTML += modalFooterButton;
          }
          modalFooterHTML = modalFooterTemplate.replace('{{buttons}}', modalFooterHTML);
        }
        modalHTML = modalHTML.replace('{{footer}}', modalFooterHTML);
        elemModal.innerHTML = modalHTML;
        document.body.appendChild(elemModal);
        return elemModal;
      }

      function _showModal() {
        if (!_destroyed && !_hiding) {
          _elemModal.classList.add('modal__show');
          document.dispatchEvent(_eventShowModal);
        }
      }

      function _hideModal() {
        _hiding = true;
        _elemModal.classList.remove('modal__show');
        _elemModal.classList.add('modal__hiding');
        setTimeout(function () {
          _elemModal.classList.remove('modal__hiding');
          _hiding = false;
        }, _animationSpeed);
        document.dispatchEvent(_eventHideModal);
      }

      function _handlerCloseModal(e) {
        if (e.target.dataset.dismiss === 'modal') {
          _hideModal();
        }
      }

      _elemModal = _createModal(options || {});


      _elemModal.addEventListener('click', _handlerCloseModal);
      _eventShowModal = new CustomEvent('show.modal', { detail: _elemModal });
      _eventHideModal = new CustomEvent('hide.modal', { detail: _elemModal });

      return {
        show: _showModal,
        hide: _hideModal,
        destroy: function () {
          _elemModal.parentElement.removeChild(_elemModal),
            _elemModal.removeEventListener('click', _handlerCloseModal),
            destroyed = true;
        },
        setContent: function (html) {
          _elemModal.querySelector('[data-modal="content"]').innerHTML = html;
        },
        setTitle: function (text) {
          _elemModal.querySelector('[data-modal="title"]').innerHTML = text;
        }
      }
    };

    (function () {
      var elemTarget;
      // создаём модальное окно
      var modal = $modal({
        title: '',
        content: `<img src="" alt="">`,
        footerButtons: [
          { class: 'btn btn__delete', text: 'ADD TO WATCHED', handler: 'modalHandlerDelete' },
          { class: 'btn btn__cancel', text: 'ADD TO QUEUE', handler: 'modalHandlerCancel' }
        ]
      });
      // при клике на документ
      document.addEventListener('click', function (e) {
        // если мы кликнули на измобржение расположенное в .img__items, то...
        if (e.target.matches('.img__items img')) {
          elemTarget = e.target;
          // устанавливаем модальному окну title
          // modal.setContent('<div class="img__items">
          //   <img src="' + e.target.src + '" alt="' + e.target.alt + '" style="display: block; height: auto; max-width: 100%; margin: 0 auto;"></div><div style="flex: 1 0 40%;"><div style="font-size: 18px; font-weight:bold;">' + e.target.dataset.name + '</div>Цена:<br><b>' + e.target.dataset.price + '$</b></div>');
          // modal.show();
          modal.setContent(` <img src="` + e.target.src + ` " alt="` + e.target.alt + ` "data-price="22500" data-name="Audi A5 Coupé">
  
  <div class="img__items">
  <h2 class="cardItem__name">Title</h2>
   
  <div class="cadrItem__item">
  <ul class="cadrItem__list">
    <li class="cadrItem__vote cardItem__text">Vote / Votes</li>
    <li class="cardItem__popularity cardItem__text">Popularity</li>
    <li class="cardItem__orig-title cardItem__text">Original Title</li>
    <li class="cardItem__genre cardItem__text">Genre</li>
  </ul>
  <ul class="cadrItem__list">
    <li class="cadrItem__vote cardItem__descr">
    <span class="cardItem__vote_average">vote</span>/
    <span class="cardItem__vote_count">votes</span></li>
    <li class="cardItem__popularity cardItem__descr">Popularity</li>
    <li class="cardItem__orig-title cardItem__descr">Original Title</li>
    <li class="cardItem__genre cardItem__descr">Genre</li>
  </ul>
  </div>

  <div>
    <h3 class="cardItem__about">About</h3>
    <p class="cardItem__about-text">ABOUT</p>
    <button class="btn button__card"></button>
    <button class="btn button__card"></button>
  </div>
  </div>`);
          modal.show();
        } else if (e.target.dataset.handler === 'modalHandlerCancel') {
          modal.hide();
        } else if (e.target.dataset.handler === 'modalHandlerDelete') {
          elemTarget.parentElement.parentElement.removeChild(elemTarget.parentElement);
          modal.hide();
        }
      });
    })();