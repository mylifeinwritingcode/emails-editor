/**
 * [ru] Так как не был указан какой стандарт использовать, модуль EmailsEditor реализован с поддержкой старых стандартов (например IE >= 7) для кроссплатформенности (например экземпляры объектов создаются через функцию а не через класс и т.д.. Хотя класс был введен в ES6, это не отменяет того, что структура и наследование объекта прототипа ориентированное).
 * [en] Since it was not specified which standard to use, the EmailsEditor module is implemented with support for old standards (for example IE> = 7) for cross-platform (for example, object instances are created through a function and not through a class, etc. Although the class was introduced in ES6, this does not negate that the structure and inheritance of the prototype object is oriented).
 * Support: Chrome >= 2, Firefox >= 3.5, Opera >= 9.4, Safari >= 4, Edge >= 12, IE >= 7.
 * Possible support (not verified): Chrome >= 1, Firefox >= 1, Opera >= 7, Safari >= 1.
 */

/**
 * [ru] Создает экземпляр объекта <strong>EmailsEditor</strong>. Также это функция является конструктором, т.е. при вызове её как функцию создает свой же экземпляр.
 * [en] Creates an instance of the <strong> EmailsEditor </strong> object. This function is also a constructor, i.e. when you call it as a function, it creates its own instance.
 * @author Eduard Ambartsumyan <iwdedam@mail.ru>.
 * @version 1.0.0.
 * @public
 * @name EmailsEditor
 * @class
 * @param {Object} options -
 *  [ru] Опции модуля <strong>EmailsEditor</strong>.
 *  [en] Module options <strong>EmailsEditor</strong>.
 * @param {Object<HTMLElement>} [options.container] -
 *  [ru] Контейнер для экземпляра <strong>EmailsEditor</strong>. Если не указать, то будет вставлен в тег body.
 *  [en] The container for the <strong> EmailsEditor </ strong> instance. If not specified, it will be inserted into the body tag.
 * @param {String} [options.header] -
 *  [ru] Заголовок формы.
 *  [en] The title of the form.
 * @param {String} [options.inputPlaceHolder] -
 *  [ru] Выводит текст внутри поля, который исчезает при получении фокуса (заполнитель).
 *  [en] Displays text inside the field that disappears when focus is received (placeholder).
 * @param {String} [options.buttonAddEmailTitle] -
 *  [ru] Наименование кнопки "Добавить электронный адрес".
 *  [en] The name of the "Add Email Address" button.
 * @param {String} [options.buttonGetEmailsCountTitle] -
 *  [ru] Наименование кнопки "Получить количество электронных писем".
 *  [en] The name of the "Get the number of emails" button.
 * @param {Boolean} [options.atPastingRightAwayAdd -
 *  [ru] При вставке электронного адреса сразу добавь в список со сохраненными, без предварительного редактирования.
 *  [en] When you insert an email address, immediately add it to the list with the saved ones, without preliminary editing.
 * @param {Number|String} [options.fixedLeftPosition] -
 *  [ru] Фиксирует редактор по левой стороне, принимает значения от 0 до 100 процентов, или если не указано ничего, тот null.
 *  [en] The editor fixes on the left side, takes values from 0 to 100 percent, or if nothing is specified, that is null.
 * @param {Number|String} [options.fixedTopPosition] -
 *  [ru] Фиксирует редактор по правой стороне, принимает значения от 0 до 100 процентов, или если не указано ничего, тот null.
 *  [en] The editor fixes on the right side, takes values from 0 to 100 percent, or if nothing is specified, that is null.
 */
function EmailsEditor(options)
{
	if ((this instanceof EmailsEditor) === false) {
		var Editor = new EmailsEditor(options);

		Editor.createEditor();

		return Editor;
	}

	if (EmailsEditor.isObject(options) === false) {
		options = {};
	}

	this.container = (EmailsEditor.isTag(options.container) === true) ? options.container : null;
	this.header = (options.header && EmailsEditor.isString(options.header) === true) ? options.header : 'Email editor';
	this.inputPlaceHolder = (options.inputPlaceHolder && EmailsEditor.isString(options.inputPlaceHolder) === true) ? options.inputPlaceHolder : 'add more people...';
	this.buttonAddEmailTitle = (options.buttonAddEmailTitle && EmailsEditor.isString(options.buttonAddEmailTitle) === true) ? options.buttonAddEmailTitle : 'Add email';
	this.buttonGetEmailsCountTitle = (options.buttonGetEmailsCountTitle && EmailsEditor.isString(options.buttonGetEmailsCountTitle) === true) ? options.buttonGetEmailsCountTitle : 'Get emails count';
	this.insertImmediately = options.atPastingRightAwayAdd === true;
	this.fixedLeftPosition = (EmailsEditor.isNumber(options.fixedLeftPosition) === true && options.fixedLeftPosition >= 0 && options.fixedLeftPosition <= 100) ? options.fixedLeftPosition : null;
	this.fixedTopPosition = (EmailsEditor.isNumber(options.fixedTopPosition) === true && options.fixedTopPosition >= 0 && options.fixedTopPosition <= 100) ? options.fixedTopPosition : null;

	/**
	 * [ru] Фиксирует зажатую клавишу Ctrl на поле ввода электронного адреса.
	 * [en] Fixes the pressed Ctrl key to the email address input field.
	 * @property {Boolean}
	 */
	this.ctrlKey = false;
	/**
	 * [ru] Фиксирует зажатую клавишу Shift на поле ввода электронного адреса.
	 * [en] Fixes the pressed Shift key on the email address input field.
	 * @property {Boolean}
	 */
	this.shiftKey = false;
	/**
	 * [ru] Сохраняет текущее значение поля ввода электронной почты.
	 * [en] Saves the current value of the email input field.
	 * @property {String}
	 */
	this.inputValue = '';
	/**
	 * [ru] Хранится список текущих электронных адресов.
	 * [en] A list of current email addresses is stored.
	 * @property {Array.{isValid: <Boolean>, value: <String>}}
	 */
	this.emails = [];

	/**
	 * [ru] Ссылка на тег основного блока.
	 * [en] Link to the tag of the main unit.
	 * @property {Object<HTMLElement>}
	 */
	this.tagMainBlock = null;
	/**
	 * [ru] Ссылка на тег с заголовком.
	 * [en] Link to the title tag.
	 * @property {Object<HTMLElement>}
	 */
	this.tagHeader = null;
	/**
	 * [ru] Ссылка на тег со списком электронных адресов.
	 * [en] Link to a tag with a list of email addresses.
	 * @property {Object<HTMLElement>}
	 */
	this.tagEmailsBox = null;
	/**
	 * [ru] Ссылка на тег для ввода электронного адреса.
	 * [en] Link to the tag to enter the email address.
	 * @property {Object<HTMLElement>}
	 */
	this.tagInputEmail = null;
	/**
	 * [ru] Ссылка на тег кнопку "Добавить электронный адрес".
	 * [en] Link to the tag button "Add Email".
	 * @property {Object<HTMLElement>}
	 */
	this.tagButtonAddEmail = null;
	/**
	 * [ru] Ссылка на тег кнопку "Получить количество электронных писем".
	 * [en] Link to the tag button "Get emails count".
	 * @property {Object<HTMLElement>}
	 */
	this.tagButtonGetEmailsCount = null;

	/**
	 * @property {Function}
	 */
	this.trackKeyDownIntoInputFieldEmail = this.trackKeyDownIntoInputFieldEmail.bind(this);
	/**
	 * @property {Function}
	 */
	this.trackKeyUpIntoInputFieldEmail = this.trackKeyUpIntoInputFieldEmail.bind(this);
	/**
	 * @property {Function}
	 */
	this.blurFromInputFieldEmail = this.blurFromInputFieldEmail.bind(this);
	/**
	 * @property {Function}
	 */
	this.fixedPosition = this.fixedPosition.bind(this);
	/**
	 * @property {Function}
	 */
	this.addRandomEmail = this.addRandomEmail.bind(this);
	/**
	 * @property {Function}
	 */
	this.alertEmailsCount = this.alertEmailsCount.bind(this);
}

/**
 * [ru] Список имен классов для тегов редактора.
 * [en] List of class names for editor tags.
 * @public
 * @static
 * @name TAG_CLASS_NAMES
 * @property {Object}
 */
EmailsEditor.TAG_CLASS_NAMES = {
	MAIN_BLOCK: 'emails-editor main-block',
	INNER_BLOCK: 'emails-editor inner-block',
	HEADER: 'emails-editor header',
	CONTROL_BLOCK: 'emails-editor control-block',
	EMAILS_BOX: 'emails-editor emails-box',
	INPUT_EMAIL_BLOCK: 'emails-editor input-email-block',
	INPUT_EMAIL: 'emails-editor input-email',
	PLACEHOLDER: 'placeholder',
	NO_PLACEHOLDER: 'no-placeholder',
	OUTPUT_EMAIL_BLOCK: 'emails-editor output-email-block',
	OUTPUT_EMAIL_LABEL: 'emails-editor output-email-label',
	VALID_EMAIL: 'valid',
	NOT_VALID_EMAIL: 'not-valid',
	BUTTON_DELETE_OUTPUT_EMAIL: 'emails-editor button-delete-output-email',
	BUTTON_ADD_EMAIL: 'emails-editor control-button button-add-email',
	BUTTON_GET_EMAILS_COUNT: 'emails-editor control-button button-get-emails-count'
};

/**
 * [ru] Проверяет является ли значение числом.
 * [en] Checks if a value is a number.
 * @public
 * @static
 * @name isNumber
 * @method
 * @property {Function}
 * @param {Number} value -
 *  [ru] Число для проверки.
 *  [en] The number to check.
 * @returns {Boolean}
 */
EmailsEditor.isNumber = function isNumber(value)
{
	return typeof value === 'number' && Number.isNaN(value) === false;
};
/**
 * [ru] Проверяет является ли значение строкой.
 * [en] Checks if a value is a string.
 * @public
 * @static
 * @name isString
 * @method
 * @property {Function}
 * @param {String} value -
 *  [ru] Строка для проверки.
 *  [en] String to check.
 * @returns {Boolean}
 */
EmailsEditor.isString = function isString(value)
{
	return typeof value === 'string';
};
/**
 * [ru] Проверяет является ли значение объектом.
 * [en] Checks if the value is an object.
 * @public
 * @static
 * @name isObject
 * @method
 * @property {Function}
 * @param {Object} value -
 *  [ru] Объект для проверки.
 *  [en] The object to check.
 * @returns {Boolean}
 */
EmailsEditor.isObject = function isObject(value)
{
	/**
	 * [ru] В JS null тоже считается объектом, поэтому его и исключаем.
	 * [en] In JS, null is also considered an object, which is why it is excluded.
	*/
	return typeof value === 'object' && value !== null;
};
/**
 * [ru] Проверяет является ли значение массивом.
 * [en] Checks if a value is an array.
 * @public
 * @static
 * @name isArray
 * @method
 * @property {Function}
 * @param {Object} value -
 *  [ru] Массив для проверки.
 *  [en] Array to check.
 * @returns {Boolean}
 */
EmailsEditor.isArray = (!Array.isArray) ? function isArray(value)
{
	return Object.prototype.toString.call(value) === '[object Array]';
} : Array.isArray;
/**
 * [ru] Проверить является ли объект тегом.
 * [en] Check if the object is a tag.
 * @public
 * @static
 * @name isTag
 * @method
 * @property {Function}
 * @param {Object} value -
 *  [ru] Тег для проверки.
 *  [en] Tag to check.
 * @returns {Boolean}
 */
EmailsEditor.isTag = function isTag(value)
{
	return EmailsEditor.isObject(value) && !!value.tagName;
};
/**
 * [ru] Проверить является ли объект текстовым узлом.
 * [en] Check if the object is a text node.
 * @public
 * @static
 * @name isTextNode
 * @method
 * @property {Function}
 * @param {Object} value -
 *  [ru] Текстовый узел для проверки.
 *  [en] Text node for verification.
 * @returns {Boolean}
 */
EmailsEditor.isTextNode = function isTextNode(value)
{
	return EmailsEditor.isObject(value) && value.nodeName === '#text';
};
/**
 * [ru] Возвращает смещенную (с учетом отступа и обводки) ширину элемента.
 * [en] Returns the offset (indentation and stroke) width of the element.
 * @public
 * @static
 * @name getElementOffsetWidth
 * @method
 * @property {Function}
 * @param {Object<HTMLElement>} element -
 *  [ru] Тег, ширину которого надо получить.
 *  [en] The tag whose width is to be obtained.
 * @returns {Number}
 */
EmailsEditor.getElementOffsetWidth = function getElementOffsetWidth(element)
{
	/**
	 * [ru] Если поддерживается метод "getBoundingClientRect", то берем смещенную ширину.
	 * [en] If the "getBoundingClientRect" method is supported, then take the offset width.
	 * Support getBoundingClientRect: Chrome, Firefox >= 3.5, Opera, Safari, Edge >= 12, IE >= 9.
	 */
	if (element.getBoundingClientRect) {
		var info = element.getBoundingClientRect();

		if (info.width) {
			/**
			 * [ru] Полученное число с плавающей точкой, приводим к целому.
			 * [en] The resulting floating-point number is reducible to an integer.
			 */
			return parseInt(info.width);
		}
	}

	/**
	 * [ru] Пытаемся получить смещенную ширину.
	 * [en] Trying to get the offset width.
	 * Support offsetWidth: Chrome >= 47, Firefox >= 1, Opera, Safari >= 11, Edge >= 12, IE.
	 */
	return element.offsetWidth || 0;
};
/**
 * [ru] Возвращает смещенную (с учетом отступа и обводки) высоту элемента.
 * [en] Returns the offset (indentation and stroke) height of the element.
 * @public
 * @static
 * @name getElementOffsetHeight
 * @method
 * @property {Function}
 * @param {Object} element -
 *  [ru] Тег, высоту которого надо получить.
 *  [en] The tag whose height you want to get.
 * @returns {Number}
 */
EmailsEditor.getElementOffsetHeight = function getElementOffsetHeight(element)
{
	/**
	 * [ru] Если поддерживается метод "getBoundingClientRect", то берем смещенную высоту.
	 * [en] If the "getBoundingClientRect" method is supported, then take the offset height.
	 * Support getBoundingClientRect: Chrome, Firefox >= 3.5, Opera, Safari, Edge >= 12, IE >= 9.
	 */
	if (element.getBoundingClientRect) {
		var info = element.getBoundingClientRect();

		if (info.height) {
			/**
			 * [ru] Полученное число с плавающей точкой, приводим к целому.
			 * [en] The resulting floating-point number is reducible to an integer.
			 */
			return parseInt(info.height);
		}
	}

	/**
	 * [ru] Пытаемся получить смещенную высоту.
	 * [en] Trying to get a shifted height.
	 * Support offsetHeight: Chrome >= 47, Firefox >= 1, Opera, Safari >= 11, Edge >= 12, IE.
	 */
	return element.offsetHeight || 0;
};
/**
 * [ru] Возвращает ширину рабочей область окна.
 * [en] Returns the width of the window pane.
 * @public
 * @static
 * @name getWindowWidth
 * @method
 * @property {Function}
 * @returns {Number}
 */
EmailsEditor.getWindowWidth = function getWindowWidth()
{
	/**
	 * [ru] Если поддерживается метод "innerWidth", то берем ширину окна от туда, иначе из смещенной ширины тега HTML.
	 * [en] If the "innerWidth: method is supported, then we take the width of the window from there, otherwise from the offset width of the HTML tag.
	 * Support innerWidth: Chrome >= 1, Firefox >= 1, Opera >= 9, Safari >= 3, Edge >= 12, IE >= 9.
	 */
	return window.innerWidth || document.documentElement && EmailsEditor.getElementOffsetWidth(document.documentElement) || 0;
};
/**
 * [ru] Возвращает высоту рабочей область окна.
 * [en] Returns the height of the window pane.
 * @public
 * @static
 * @name getWindowHeight
 * @method
 * @property {Function}
 * @returns {Number}
 */
EmailsEditor.getWindowHeight = function getWindowHeight()
{
	/**
	 * [ru] Если поддерживается метод "innerHeight", то берем высоту окна от туда, иначе из смещенной высоты тега HTML.
	 * [en] If the "innerHeight" method is supported, then we take the height of the window from there, otherwise from the offset height of the HTML tag.
	 * Support innerHeight: Chrome >= 1, Firefox >= 1, Opera >= 9, Safari >= 3, Edge >= 12, IE >= 9.
	 */
	return window.innerHeight || document.documentElement && EmailsEditor.getElementOffsetHeight(document.documentElement) || 0;
};
/**
 * [ru] Возвращает ссылку на тег <strong>body</strong>.
 * [en] Returns a link to the <strong>body</strong> tag.
 * @public
 * @static
 * @name getBody
 * @method
 * @property {Function}
 * @returns {Object<HTMLElement>}
 */
EmailsEditor.getBody = function getBody()
{
	/**
	 * Support body: Chrome >= 1, Firefox >= 2, Opera >= 9.6, Safari >= 4, Edge >= 12, IE >= 6.
	 */
	return document.body ||
	/**
	 * Support getElementsByTagName: Chrome >= 1, Firefox, Opera, Safari, Edge, IE >= 5.5.
	 */
		document.getElementsByTagName('BODY')[0];
};
/**
 * [ru] Создает и возвращает тег.
 * [en] Creates and returns a tag.
 * @public
 * @static
 * @name createElement
 * @method
 * @property {Function}
 * @param {String} name -
 *  [ru] Имя создаваемого тега.
 *  [en] The name of the tag to create.
 * @param {Array.{key: <String>, value: <Any>}} [attributes] -
 *  [ru] Список оттрибутов создоваемого тега.
 *  [en] Список атрибутов создаваемого тега.
 * @returns {Object<HTMLElement>}
 */
EmailsEditor.createElement = function createElement(name, attributes)
{
	if (EmailsEditor.isString(name) === false) {
		throw new Error('argument name is not string');
	}

	var tag = document.createElement(name.toUpperCase());

	if (
		tag &&
		EmailsEditor.isArray(attributes) === true
	) {
		var className;
		var value;

		for (var i = attributes.length ; i-- ; ) {
			var attribute = attributes[i];

			if (
				EmailsEditor.isObject(attribute) === true &&
				EmailsEditor.isString(attribute.key) === true
			) {
				switch (attribute.key) {
					case 'class':
					case 'className':
						className = attribute.value;
						break;
					case 'value':
						value = attribute.value;
						break;
					default:
						tag.setAttribute(attribute.key, (attribute.value !== undefined) ? attribute.value : '');
				}
			}
		}

		/**
		 * [ru] При назначении атрибутов через метод setAttribute у браузеров IE <= 7 не назначается class и value, поэтому переназначаем через присваивание напрямую, class через className, value через value.
		 * [en] When assigning attributes through the setAttribute method, IE <= 7 does not assign class and value to browsers, so we reassign via assignment directly, class via className, value via value.
		 */

		if (className !== undefined) {
			tag.className = className;
		}

		if (value !== undefined) {
			tag.value = value;
		}
	}

	return tag;
};
/**
 * [ru] Создает и возвращает текстовый узел.
 * [en] Creates and returns a text node.
 * @public
 * @static
 * @name createTextNode
 * @method
 * @property {Function}
 * @param {String} text -
 *  [ru] Текст для текстового узла.
 *  [en] The text for the text node.
 * @returns {Object<Text>}
 */
EmailsEditor.createTextNode = function createTextNode(text)
{
	if (EmailsEditor.isString(text) === false) {
		throw new Error('argument name is not string');
	}

	return document.createTextNode(text);
};
/**
 * [ru] Удаляет тег или текстовый узел.
 * [en] Deletes a tag or text node.
 * @public
 * @static
 * @name removeElement
 * @method
 * @property {Function}
 * @param {Object<HTMLElement, Text>} element -
 *  [ru] Тег или текстовый узел.
 *  [en] Tag or text node.
 */
EmailsEditor.removeElement = function removeElement(element)
{
	if (
		(EmailsEditor.isTag(element) === true || EmailsEditor.isTextNode(element) === true) &&
		element.parentNode
	) {
		element.parentNode.removeChild(element);
	}
};
/**
 * [ru] Очистить тег или текстовый узел.
 * [en] Clear tag or text node.
 * @public
 * @static
 * @name clearElement
 * @method
 * @property {Function}
 * @param {Object<HTMLElement, Text>} element -
 *  [ru] Тег или текстовый узел.
 *  [en] Tag or text node.
 */
EmailsEditor.clearElement = function clearElement(element)
{
	if (EmailsEditor.isTag(element) === true) {
		if (element.value) {
			element.value = '';
		}

		if (
			element.childNodes &&
			element.childNodes.length
		) {
			for (var i = element.childNodes.length ; i-- ; ) {
				EmailsEditor.removeElement(element.childNodes[i]);
			}
		}

		return;
	}

	if (EmailsEditor.isTextNode(element) === true) {
		element.nodeValue = '';
	}
};
/**
 * [ru] Добавить потомка в тег.
 * [en] Add a child to the tag.
 * @public
 * @static
 * @name appendChild
 * @method
 * @property {Function}
 * @param {Object<HTMLElement>} parent -
 *  [ru] Родительский тег.
 *  [en] Parent tag.
 * @param {Object<HTMLElement, Text>|String} child -
 *  [ru] Вставляемый потомок, тег, текстовый узел или HTML строка.
 *  [en] The inserted child, tag, text node, or HTML string.
 */
EmailsEditor.appendChild = function appendChild(parent, child)
{
	if (EmailsEditor.isTag(parent) === false) {
		throw new Error('argument parent is not tag');
	}

	if (
		EmailsEditor.isTag(child) === true ||
		EmailsEditor.isTextNode(child) === true
	) {
		parent.appendChild(child);

		return;
	}

	if (EmailsEditor.isString(child) === true) {
		parent.innerHTML = child;

		return;
	}

	throw new Error('argument child is not correct');
};
/**
 * [ru] Добавить потомка перед потомком.
 * [en] Add a descendant before the descendant.
 * @public
 * @static
 * @name insertBefore
 * @method
 * @property {Function}
 * @param {Object<HTMLElement>} parent -
 *  [ru] Родительский тег.
 *  [en] Parent tag.
 * @param {Object<HTMLElement, Text>|String} child -
 *  [ru] Вставляемый потомок, тег или текстовый узел.
 *  [en] The inserted child, tag, or text node.
 * @param {Object<HTMLElement, Text>|String} referenceChild -
 *  [ru] Потомок, перед которым ставится вставляемый потомок.
 *  [en] Descendant before which the inserted descendant is placed.
 */
EmailsEditor.insertBefore = function insertBefore(parent, child, referenceChild)
{
	if (EmailsEditor.isTag(parent) === false) {
		throw new Error('argument parent is not tag');
	}

	if (
		EmailsEditor.isTag(child) === true ||
		EmailsEditor.isTextNode(child) === true
	) {
		parent.insertBefore(child, (EmailsEditor.isTag(referenceChild) === true || EmailsEditor.isTextNode(referenceChild) === true) ? referenceChild : null);

		return;
	}

	throw new Error('argument child is not correct');
};
/**
 * [ru] Собирает имена классов в одну кучу.
 * [en] Collects class names in one heap.
 * @public
 * @static
 * @name collectClassName
 * @method
 * @property {Function}
 * @param {String...} [className] -
 *  [ru] Имя класса для тега в каждом аргументе.
 *  [en] The class name for the tag in each argument.
 * @returns {String}
 */
EmailsEditor.collectClassName = function collectClassName()
{
	var classNameArray = [];

	for (var l = arguments.length, i = 0 ; i < l ; i++) {
		var className = arguments[i];

		if (
			className &&
			EmailsEditor.isString(className) === true
		) {
			classNameArray.push(className);
		}
	}

	return classNameArray.join(' ');
};
/**
 * [ru] Добавляет обработчик на указанное событие.
 * [en] Adds a handler to the specified event.
 * @public
 * @static
 * @name addEvent
 * @method
 * @property {Function}
 * @param {Object} element -
 *  [ru] Тег, у которого добавляется событие.
 *  [en] The tag on which the event is being added.
 * @param {String} name -
 *  [ru] Имя назначаемого события.
 *  [en] The name of the event to be assigned.
 * @param {Function} callback -
 *  [ru] Метод, который выполняется при обработке события.
 *  [en] The method that is executed when the event is processed.
 */
EmailsEditor.addEvent = function addEvent(element, name, callback)
{
	/**
	 * Support innerWidth: Chrome >= 1, Firefox >= 1, Opera >= 7, Safari >= 1, Edge >= 12, IE >= 9.
	 */
	if (element.addEventListener) {
		element.addEventListener(name, callback);

		return;
	}

	/**
	 * Support innerWidth: Opera >= 1, IE >= 6 & <= 8.
	 */
	if (element.attachEvent)  {
		element.attachEvent('on' + name, callback);
	}
};
/**
 * [ru] Удаляет обработчик с указанным событием.
 * [en] Deletes a handler with the specified event.
 * @public
 * @static
 * @name removeEvent
 * @method
 * @property {Function}
 * @param {Object} element -
 *  [ru] Тег, у которого удалиться событие.
 *  [en] The tag at which the event is deleted.
 * @param {String} name -
 *  [ru] Имя удаляемого событие.
 *  [en] The name of the event to delete.
 * @param {Function} callback -
 *  [ru] Метод удаляемого события.
 *  [en] Method of the deleted event.
 */
EmailsEditor.removeEvent = function removeEvent(element, name, callback)
{
	/**
	 * Support innerWidth: Chrome >= 1, Firefox >= 1, Opera >= 7, Safari >= 1, Edge >= 12, IE >= 9.
	 */
	if (element.removeEventListener) {
		element.removeEventListener(name, callback);

		return;
	}

	/**
	 * Support innerWidth: Opera >= 1, IE >= 6 & <= 8.
	 */
	if (element.detachEvent)  {
		element.detachEvent('on' + name, callback);
	}
};
/**
 * [ru] Предотвращает дальнейшее выполнение события, но не всплывает.
 * [en] Prevents further execution of the event, but does not pop up.
 * @public
 * @static
 * @name preventDefault
 * @method
 * @property {Function}
 * @param {Object} event
 */
EmailsEditor.preventDefault = function preventDefault(event)
{
	/**
	 * Support innerWidth: Chrome >= 4, Firefox >= 2, Opera >= 7, Safari >= 3.1, Edge >= 12, IE >= 9.
	 */
	if (event.preventDefault) {
		event.preventDefault();

		return;
	}

	/**
	 * Support innerWidth: Chrome >= 1, Opera >= 1, Safari >= 1, Edge >= 12, IE >= 6 & <= 8.
	 */
	event.returnValue = false;
};
/**
 * [ru] Возвращает ссылку на текущий <HTMLElement> через объект event.
 * [en] Returns a reference to the current <HTMLElement> through the event object.
 * @public
 * @static
 * @name getTargetElement
 * @method
 * @property {Function}
 * @param {Object} event
 * @returns {Object<HTMLElement>}
 */
EmailsEditor.getTargetElement = function getTargetElement(event)
{
	return event.target || event.srcElement;
};
/**
 * [ru] Возвращает код нажатой клавиши.
 * [en] Returns the code of the pressed key.
 * @public
 * @static
 * @name getKeyboardKeyCode
 * @method
 * @property {Function}
 * @param {Object} event
 * @returns {Number|Null}
 */
EmailsEditor.getKeyboardKeyCode = function getKeyboardKeyCode(event)
{
	/**
	 * Support innerWidth: Chrome >= 26, Firefox >= 3, Opera >= 12.1, Safari >= 5, Edge >= 12, IE >= 6.
	 */
	if (event.keyCode !== undefined) {
		return event.keyCode;
	}

	/**
	 * Support innerWidth: Chrome >= 4, Firefox >= 2, Opera >= 10, Safari >= 5, Edge >= 12, IE >= 9.
	 */
	if (event.which !== undefined) {
		return event.which;
	}

	/**
	 * Support innerWidth: Chrome >= 26, Firefox >= 3, Opera >= 12.1, Safari >= 5.1, Edge >= 12, IE >= 9.
	 */
	if (event.charCode !== undefined) {
		return event.charCode;
	}

	return null;
};
/**
 * [ru] Получить последний кусок значения тега, содержимого тега или текстового узла.
 * [en] Get the last piece of tag value, tag content, or text node.
 * @public
 * @static
 * @name getLastPieceOfElement
 * @method
 * @property {Function}
 * @param {HTMLElement|Text} element -
 *  [ru] Тег или текстовый узел.
 *  [en] Tag or text node.
 * @returns {String|Tag|Text}
 */
EmailsEditor.getLastPieceOfElement = function getLastPieceOfElement (element)
{
	if (
		element.value &&
		element.value.length
	) {
		return element.value.charAt(element.value.length - 1);
	}

	if (EmailsEditor.isTextNode(element) === true) {
		return (element.nodeValue && element.nodeValue.length) ? element.nodeValue.charAt(element.nodeValue.length - 1) : '';
	}

	if (
		EmailsEditor.isTag(element) === true &&
		element.childNodes &&
		element.childNodes.length
	) {
		var lastChildren = element.childNodes[element.childNodes.length - 1];

		if (lastChildren) {
			if (EmailsEditor.isTag(lastChildren) === true) {
				return lastChildren;
			}

			if (
				EmailsEditor.isTextNode(lastChildren) === true &&
				lastChildren.nodeValue &&
				lastChildren.nodeValue.length
			) {
				return lastChildren.nodeValue.charAt(lastChildren.nodeValue.length - 1);
			}
		}
	}

	return '';
};
/**
 * [ru] Проверка электронного адреса на валидность. Строгая проверка, допускаются символы "a-zA-Zа-яА-Я0-9-_" для логина и домена.
 * [en] Validation of email address. Strict verification, the characters "a-zA-Zа-яА-Я0-9-_" are allowed for the login and domain.
 * @public
 * @static
 * @name checkValidEmail
 * @method
 * @property {Function}
 * @param {String} email -
 *  [ru] Электронный адрес для проверки.
 *  [en] Email address to verify.
 * @returns {Boolean}
 */
EmailsEditor.checkValidEmail = function checkValidEmail(email)
{
	return EmailsEditor.isString(email) === true && email.search(/^\w+(\-\w+)*(\.\w+(\-\w+)*)*@\w+(\-\w+)*(\.\w+(\-\w+)*)+$/) > -1;
};
/**
 * [ru] Генерирует случайное число в диапазоне от минимального до максимального значения.
 * [en] Generates a random number in the range from minimum to maximum value.
 * @public
 * @static
 * @name getRandomInt
 * @method
 * @property {Function}
 * @param {Number} min -
 *  [ru] Начальное число диапазона.
 *  [en] The starting number of the range.
 * @param {Number} max -
 *  [ru] Конечное число диапазона.
 *  [en] The ending number of the range.
 * @returns {Number}
 */
EmailsEditor.getRandomInt = function getRandomInt(min, max)
{
	min = Math.ceil(min);
	max = Math.floor(max);

	return Math.floor(Math.random() * (max - min + 1)) + min;
};
/**
 * [ru] Генерирует случайный электронный адрес, логин длины в 10 символов, домен из списка: gmail.com, yandex.ru, mail.ru.
 * [en] Generates a random email address, login length of 10 characters, domain from the list: gmail.com, yandex.ru, mail.ru.
 * @public
 * @static
 * @name getRandomInt
 * @method
 * @property {Function}
 * @returns {String}
 */
EmailsEditor.getRandomEmail = function getRandomEmail()
{
	var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
	var numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	var domains = ['gmail.com', 'yandex.ru', 'mail.ru'];
	var randomEmail = '';
	var min = 0;
	var max = letters.length - 1;
	var i = 5;

	while (i--) {
		randomEmail += letters[EmailsEditor.getRandomInt(min, max)];
	}

	max = numbers.length - 1;
	i = 5;

	while (i--) {
		randomEmail += numbers[EmailsEditor.getRandomInt(min, max)];
	}

	randomEmail += '@';
	max = domains.length - 1;
	randomEmail += domains[EmailsEditor.getRandomInt(min, max)];

	return randomEmail;
};

/**
 * [ru] Отслеживает нажатие клавиши в поле ввода.
 * [en] Monitors keystrokes in the input field.
 * @private
 * @name trackKeyDownIntoInputFieldEmail
 * @method
 * @param {Object} event
 */
EmailsEditor.prototype.trackKeyDownIntoInputFieldEmail = function trackKeyDownIntoInputFieldEmail(event)
{
	event = event || window.event;

	/**
	 * [ru] Запоминает нажата ли клавиша CTRL.
	 * [en] Remember whether the CTRL key is pressed.
	 */
	this.ctrlKey = event.ctrlKey === true;
	/**
	 * [ru] Запоминает нажата ли клавиша Shift.
	 * [en] Remember whether the Shift key is pressed.
	 */
	this.shiftKey = event.shiftKey === true;

	/**
	 * [ru] Если ранее ничего не вводилось, то очищает поле ввода для электронного адреса.
	 * [en] If nothing has been entered before, it clears the input field for the email address.
	 */
	if (!this.inputValue) {
		this.tagInputEmail.value = '';
	}
};
/**
 * [ru] Получает код нажатой клавиши.
 * [en] Gets the code of the pressed key.
 * @private
 * @name getKeyboardCode
 * @method
 * @param {Object} event
 * @returns {String}
 */
EmailsEditor.prototype.getKeyboardCode = function getKeyboardCode(event)
{
	if (event.code) {
		return event.code;
	}

	/**
	 * [ru] Если не поддерживается "code" в событие.
	 * [en] If "code" is not supported in the event.
	 */
	switch (event.key) {
		case ',':
			return 'Comma';
		case 'Enter':
			return 'Enter';
	}

	/**
	 * [ru] Если не поддерживается key в событие. Для старых браузеров и IE < 9.
	 * [en] If key is not supported in the event. For older browsers and IE <9.
	 */
	switch (EmailsEditor.getKeyboardKeyCode(event)) {
		case 13:
			return 'Enter';
		case 86:
			return (this.ctrlKey === true) ? 'KeyV' : '';
		case 188:
			if (this.shiftKey === true) {
				return '';
			}
		case 191:
			if (this.shiftKey === false) {
				return '';
			}

			switch (EmailsEditor.getLastPieceOfElement(this.tagInputEmail)) {
				case ',':
					return 'Comma';
			}
	}

	return '';
};
/**
 * [ru] Удаляет тег с электронным адресом и электронный адрес из списка.
 * [en] Removes an email tag and an email address from the list.
 * @private
 * @name getKeyboardCode
 * @method
 * @param {Object} emailBlock -
 *  [ru] Ссылка на тег с электронным адресом.
 *  [en] Link to a tag with an email address.
 * @param {String} email -
 *  [ru] Электронный адрес.
 *  [en] Email address.
 */
EmailsEditor.prototype.deleteOutputEmail = function deleteOutputEmail(emailBlock, email)
{
	EmailsEditor.removeElement(emailBlock);

	var newEmails = [];

	for (var l = this.emails.length, i = 0 ; i < l ; i++) {
		var emailCell = this.emails[i];

		if (emailCell.value != email) {
			newEmails.push(emailCell);
		}
	}

	this.emails = newEmails;
};
/**
 * [ru] Выводит тег с электронным адресом и привязывает к не события.
 * [en] Displays a tag with an email address and attaches to no events.
 * @private
 * @name getKeyboardCode
 * @method
 * @param {Boolean} isValid -
 *  [ru] Указывает является ли выводимый электронный адрес валидным.
 *  [en] Indicates whether the displayed email address is valid.
 * @param {String} email -
 *  [ru] Выводимый электронный адрес.
 *  [en] The displayed email address.
 */
EmailsEditor.prototype.outputEmail = function outputEmail(isValid, email)
{
	var emailBlock = EmailsEditor.createElement('DIV', [
		{
			key: 'class',
			value: EmailsEditor.collectClassName(EmailsEditor.TAG_CLASS_NAMES.OUTPUT_EMAIL_BLOCK, ((isValid === true) ? EmailsEditor.TAG_CLASS_NAMES.VALID_EMAIL : EmailsEditor.TAG_CLASS_NAMES.NOT_VALID_EMAIL))
		}
	]);
	var emailLabel = EmailsEditor.createElement('DIV', [
		{
			key: 'class',
			value: EmailsEditor.TAG_CLASS_NAMES.OUTPUT_EMAIL_LABEL
		}
	]);
	var buttonDeleteButton = EmailsEditor.createElement('IMG', [
		{
			key: 'src',
			value: 'image/delete-button.png'
		},
		{
			key: 'class',
			value: EmailsEditor.TAG_CLASS_NAMES.BUTTON_DELETE_OUTPUT_EMAIL
		}
	]);

	EmailsEditor.addEvent(buttonDeleteButton, 'click', this.deleteOutputEmail.bind(this, emailBlock, email));

	EmailsEditor.insertBefore(this.tagEmailsBox, emailBlock, this.tagInputEmail.parentNode);
	EmailsEditor.appendChild(emailBlock, emailLabel);
	EmailsEditor.appendChild(emailLabel, EmailsEditor.createTextNode(email));
	EmailsEditor.appendChild(emailBlock, buttonDeleteButton);
};
/**
 * [ru] Разбирает строку и собирает перед выводом список с электронными адресами.
 * [en] Parses a string and collects a list with email addresses before output.
 * @private
 * @name getKeyboardCode
 * @method
 * @param {String|Array} emailList -
 *  [ru] Строка (разделенная запятыми) или массив с электронными адресами.
 *  [en] A string (separated by commas) or an array with email addresses.
 * @returns {Boolean} -
 *  [ru] Возвращает true, если при добавлении не были идентичные электронные адреса.
 *  [en] Returns true if there were no identical email addresses when adding.
 */
EmailsEditor.prototype.setEmail = function setEmail(emailList)
{
	var addedEmailCount = 0;
	var emails;

	if (EmailsEditor.isString(emailList) === true) {
		emails = emailList.split(',');
	} else if (EmailsEditor.isArray(emailList) === true) {
		emails = emailList;
	}

	if (
		emails &&
		emails.length
	) {
		for (var l = emails.length, i = 0 ; i < l ; i++) {
			var email = emails[i].trim();

			if (email.length) {
				var isEqual = false;

				for (var j = this.emails.length ; j-- ; ) {
					var emailCell = this.emails[j];

					if (emailCell.value === email) {
						isEqual = true;

						break;
					}
				}

				/**
				 * [ru] Если не находит совпадения, то добавляет в список.
				 * [en] If it does not find a match, then it is added to the list.
				 */
				if (isEqual === false) {
					var isValid = EmailsEditor.checkValidEmail(email);

					this.emails.push({
						isValid: isValid,
						value: email
					});

					this.outputEmail(isValid, email);
					addedEmailCount++;
				}
			}
		}
	}

	return addedEmailCount > 0;
};
/**
 * [ru] Вызывается при потере фокуса.
 * [en] Called when focus is lost.
 * @private
 * @name getKeyboardCode
 * @method
 */
EmailsEditor.prototype.blurFromInputFieldEmail = function blurFromInputFieldEmail()
{
	this.setEmail(this.inputValue);
	this.inputValue = '';
	this.tagInputEmail.value = this.inputPlaceHolder;
	this.tagInputEmail.className = EmailsEditor.collectClassName(EmailsEditor.TAG_CLASS_NAMES.INPUT_EMAIL, EmailsEditor.TAG_CLASS_NAMES.PLACEHOLDER);
};
/**
 * [ru] Отслеживает нажатие клавиши в поле ввода.
 * [en] Monitors keystrokes in the input field.
 * @private
 * @name trackKeyUpIntoInputFieldEmail
 * @method
 * @param {Object} event
 */
EmailsEditor.prototype.trackKeyUpIntoInputFieldEmail = function trackKeyUpIntoInputFieldEmail(event)
{
	event = event || window.event;

	if (this.tagInputEmail.value) {
		this.inputValue = this.tagInputEmail.value;
		this.tagInputEmail.className = EmailsEditor.collectClassName(EmailsEditor.TAG_CLASS_NAMES.INPUT_EMAIL, EmailsEditor.TAG_CLASS_NAMES.NO_PLACEHOLDER);
	} else {
		this.tagInputEmail.value = this.inputPlaceHolder;
		this.inputValue = '';
		this.tagInputEmail.className = EmailsEditor.collectClassName(EmailsEditor.TAG_CLASS_NAMES.INPUT_EMAIL, EmailsEditor.TAG_CLASS_NAMES.PLACEHOLDER);
	}

	switch (this.getKeyboardCode(event)) {
		case 'KeyV':
			if (this.insertImmediately === false) {
				break;
			}
		case 'Enter':
		case 'Comma':
			this.blurFromInputFieldEmail();
	}

	this.ctrlKey = false;
	this.shiftKey = false;
};
/**
 * [ru] Обновляет окружение редактор.
 * [en] Updates the editor environment.
 * @private
 * @name updateEnvironmentEditor
 * @method
 */
EmailsEditor.prototype.updateEnvironmentEditor = function updateEnvironmentEditor()
{
	/**
	 * [ru] Удаляет событие фиксации редактора перед его вставкой, во избежания.
	 * [en] Deletes an editor commit event before inserting it, to avoid
	 */
	EmailsEditor.removeEvent(window, 'resize', this.fixedPosition);
	EmailsEditor.appendChild(this.container, this.tagMainBlock);

	/**
	 * [ru] Если задана фиксация по сторонам, то задает её.
	 * [en] If the fixation is set on the sides, then sets it.
	 */
	if (
		this.fixedLeftPosition !== null ||
		this.fixedTopPosition !== null
	) {
		this.tagMainBlock.style.position = 'absolute';
		EmailsEditor.addEvent(window, 'resize', this.fixedPosition);
		this.fixedPosition();
	} else {
		this.tagMainBlock.style.position = '';
	}

	/**
	 * [ru] Проверяет было ли задании значение, если да, то заполняет поле с электронным адресом, иначе заполняет заполнителем.
	 * [en] Checks if the task had a value, if so, it fills in the field with an email address, otherwise it fills with a placeholder.
	 */
	if (this.inputValue) {
		this.tagInputEmail.value = this.inputValue;
		this.tagInputEmail.className = EmailsEditor.collectClassName(EmailsEditor.TAG_CLASS_NAMES.INPUT_EMAIL, EmailsEditor.TAG_CLASS_NAMES.NO_PLACEHOLDER);
	} else {
		this.tagInputEmail.value = this.inputPlaceHolder;
		this.tagInputEmail.className = EmailsEditor.collectClassName(EmailsEditor.TAG_CLASS_NAMES.INPUT_EMAIL, EmailsEditor.TAG_CLASS_NAMES.PLACEHOLDER);
	}
};
/**
 * [ru] Фиксирует положение редактора по указанным позициям.
 * [en] Fixes the position of the editor for the specified positions.
 * @private
 * @name fixedPosition
 * @method
 */
EmailsEditor.prototype.fixedPosition = function fixedPosition()
{
	/**
	 * [ru] Если задано, то фиксирует редактор по левой стороне.
	 * [en] If set, then fixes the editor on the left side.
	 */
	if (this.fixedLeftPosition !== null) {
		this.tagMainBlock.style.left = (EmailsEditor.getWindowWidth() / 100 * this.fixedLeftPosition - EmailsEditor.getElementOffsetWidth(this.tagMainBlock) / 2) + 'px';
	}

	/**
	 * [ru] Если задано, то фиксирует редактор по правой стороне.
	 * [en] If set, then fixes the editor on the right side.
	 */
	if (this.fixedTopPosition !== null) {
		this.tagMainBlock.style.top = (EmailsEditor.getWindowHeight() / 100 * this.fixedTopPosition - EmailsEditor.getElementOffsetHeight(this.tagMainBlock) / 2) + 'px';
	}
};
/**
 * [ru] Добавляет в поле ввода электронного адреса случайно сгенерированный электронный адрес.
 * [en] Adds a randomly generated email address to the email address input field.
 * @public
 * @name addRandomEmail
 * @method
 */
EmailsEditor.prototype.addRandomEmail = function addRandomEmail()
{
	this.setEmail(EmailsEditor.getRandomEmail());
};
/**
 * [ru] Получает информацию о количестве валидных и не валидных электронных адресов.
 * [en] Gets information about the number of valid and invalid email addresses.
 * @public
 * @name getEmailsCount
 * @method
 * @returns {{validEmailCount: <Number>, inValidEmailCount: <Number>}}
 */
EmailsEditor.prototype.getEmailsCount = function getEmailsCount()
{
	var validEmailCount = 0;
	var inValidEmailCount = 0;

	for (var i = this.emails.length ; i-- ; ) {
		var emailCell  = this.emails[i];

		(emailCell.isValid === true) ? validEmailCount++ : inValidEmailCount++;
	}

	return {
		validEmailCount: validEmailCount,
		inValidEmailCount: inValidEmailCount
	};
};
/**
 * [ru] Выводит предупреждение о количестве валидных и не валидных электронных адресов.
 * [en] It displays a warning about the number of valid and invalid email addresses.
 * @public
 * @name alertEmailsCount
 * @method
 */
EmailsEditor.prototype.alertEmailsCount = function alertEmailsCount()
{
	var emailsCount = this.getEmailsCount();
	var message = '';

	if (emailsCount.validEmailCount > 0) {
		message += 'Valid emails count = ' + emailsCount.validEmailCount + "\n";
	}

	if (emailsCount.inValidEmailCount > 0) {
		message += 'Invalid emails count = ' + emailsCount.inValidEmailCount;
	}

	alert(message);
};
/**
 * [ru] Создает редактор электронных адресов.
 * [en] Creates an email address editor.
 * @public
 * @name createEditor
 * @method
 */
EmailsEditor.prototype.createEditor = function createEditor()
{
	/**
	 * [ru] Если не задан контейнер для редактора, то по умолчанию задается в качестве контейнера тег body.
	 * [en] If the container for the editor is not specified, then by default the body tag is set as the container.
	 */
	if (EmailsEditor.isTag(this.container) === false) {
		this.container = EmailsEditor.getBody();
	}

	/**
	 * [ru] Если экземпляр контейнера уже создан и сохранен в экземпляре объекта EmailsEditor, то проверяет, если он не выведен, то выводит, иначе создаст новый экземпляр редактора.
	 * [en] If the container instance has already been created and saved in the instance of the EmailsEditor object, then it checks if it is not displayed, then it displays, otherwise it will create a new editor instance.
	 */
	if (EmailsEditor.isTag(this.tagMainBlock) === true) {
		if (this.tagMainBlock.parentNode !== this.container) {
			this.updateEnvironmentEditor();
		}

		return;
	}

	this.tagMainBlock = EmailsEditor.createElement('DIV', [
		{
			key: 'class',
			value: EmailsEditor.TAG_CLASS_NAMES.MAIN_BLOCK
		}
	]);
	var innerBlock = EmailsEditor.createElement('DIV', [
		{
			key: 'class',
			value: EmailsEditor.TAG_CLASS_NAMES.INNER_BLOCK
		}
	]);
	this.tagHeader = EmailsEditor.createElement('DIV', [
		{
			key: 'class',
			value: EmailsEditor.TAG_CLASS_NAMES.HEADER
		}
	]);
	this.tagEmailsBox = EmailsEditor.createElement('DIV', [
		{
			key: 'class',
			value: EmailsEditor.TAG_CLASS_NAMES.EMAILS_BOX
		}
	]);
	var tagInputEmailBlock = EmailsEditor.createElement('DIV', [
		{
			key: 'class',
			value: EmailsEditor.TAG_CLASS_NAMES.INPUT_EMAIL_BLOCK
		}
	]);
	this.tagInputEmail = EmailsEditor.createElement('INPUT', [
		{
			key: 'type',
			value: 'text'
		},
		{
			key: 'class',
			value: EmailsEditor.TAG_CLASS_NAMES.INPUT_EMAIL
		}
	]);
	var controlBlock = EmailsEditor.createElement('DIV', [
		{
			key: 'class',
			value: EmailsEditor.TAG_CLASS_NAMES.CONTROL_BLOCK
		}
	]);
	this.tagButtonAddEmail = EmailsEditor.createElement('BUTTON', [
		{
			key: 'class',
			value: EmailsEditor.TAG_CLASS_NAMES.BUTTON_ADD_EMAIL
		}
	]);
	this.tagButtonGetEmailsCount = EmailsEditor.createElement('BUTTON', [
		{
			key: 'class',
			value: EmailsEditor.TAG_CLASS_NAMES.BUTTON_GET_EMAILS_COUNT
		}
	]);

	EmailsEditor.addEvent(this.tagInputEmail, 'keydown', this.trackKeyDownIntoInputFieldEmail);
	EmailsEditor.addEvent(this.tagInputEmail, 'keyup', this.trackKeyUpIntoInputFieldEmail);
	EmailsEditor.addEvent(this.tagInputEmail, 'blur', this.blurFromInputFieldEmail);
	EmailsEditor.addEvent(this.tagButtonAddEmail, 'click', this.addRandomEmail);
	EmailsEditor.addEvent(this.tagButtonGetEmailsCount, 'click', this.alertEmailsCount);

	EmailsEditor.appendChild(this.tagMainBlock, innerBlock);
	EmailsEditor.appendChild(this.tagHeader, this.header);
	EmailsEditor.appendChild(innerBlock, this.tagHeader);
	EmailsEditor.appendChild(innerBlock, this.tagEmailsBox);
	EmailsEditor.appendChild(this.tagEmailsBox, tagInputEmailBlock);
	EmailsEditor.appendChild(tagInputEmailBlock, this.tagInputEmail);
	EmailsEditor.appendChild(this.tagMainBlock, controlBlock);
	EmailsEditor.appendChild(this.tagButtonAddEmail, EmailsEditor.createTextNode(this.buttonAddEmailTitle));
	EmailsEditor.appendChild(controlBlock, this.tagButtonAddEmail);
	EmailsEditor.appendChild(this.tagButtonGetEmailsCount, EmailsEditor.createTextNode(this.buttonGetEmailsCountTitle));
	EmailsEditor.appendChild(controlBlock, this.tagButtonGetEmailsCount);

	this.updateEnvironmentEditor();
};
/**
 * [ru] Удаляет редактор электронных адресов из контейнера но не из экземпляра объекта EmailsEditor. Чтоб полностью его удалить, надо очистить переменную tagMainBlock в экземпляре объекта EmailsEditor, или удалить экземпляр объекта. Это сделано для того, что не создавать повторно всю цепочку элементов редактора, а просто вывести его в контейнер после допустим его сокрытия (способы на течение обстоятельств).
 * [en] Removes the email editor from the container but not from the instance of the EmailsEditor object. To completely remove it, you must clear the tagMainBlock variable in the instance of the EmailsEditor object, or delete the instance of the object. This is done in order not to re-create the entire chain of editor elements, but simply to bring it into the container after supposing it is hidden (ways for the circumstances).
 * @public
 * @name removeEditor
 * @method
 */
EmailsEditor.prototype.removeEditor = function removeEditor()
{
	/**
	 * [ru] Очистить событие фиксации редактора.
	 * [en] Clear editor commit event.
	 */
	EmailsEditor.removeEvent(window, 'resize', this.fixedPosition);
	/**
	 * [ru] Удалить редактора.
	 * [en] Remove editor.
	 */
	EmailsEditor.removeElement(this.tagMainBlock);
};
/**
 * [ru] Возвращает список валидных электронных адресов.
 * [en] Returns a list of valid email addresses.
 * @public
 * @name getValidEmails
 * @method
 */
EmailsEditor.prototype.getValidEmails = function getValidEmails()
{
	var emailList = [];

	for (var l = this.emails.length, i = 0 ; i < l ; i++) {
		var email = this.emails[i];

		if (email.isValid === true) {
			emailList.push(email.value);
		}
	}

	return emailList;
};

/**
 * [ru] Полифил для старых браузеров без поддержки статического метода "isNaN" у объекта Number.
 * [en] Polyphile for older browsers without support for the static "isNaN" method of the Number object.
 */
if (!Number.isNaN) {
	Number.isNaN = function(value)
	{
		return isNaN(value);
	};
}
/**
 * [ru] Полифил для старых браузеров без поддержки метода "bind" у объекта Function.
 * [en] Polyphile for older browsers without support for the "bind" method of the Function object.
 */
if (!Function.prototype.bind) {
	Function.prototype.bind = function bind(oThis)
	{
		if (typeof this !== 'function') {
			throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
		}

		var aArgs = Array.prototype.slice.call(arguments, 1);
		var fToBind = this;
		var fNOP = function() {};
		var fBound = function()
		{
			return fToBind.apply(((this instanceof fNOP) === true && oThis) ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
		};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	};
}
/**
 * [ru] Полифил для старых браузеров без поддержки метода "trim" у объекта String.
 * [en] Polyphile for older browsers without support for the "trim" method of the String object.
 */
if (!String.prototype.trim) {
	String.prototype.trim = function trim()
	{
		/**
		 * [ru] Вырезаем BOM и неразрывный пробел.
		 * [en] Cut BOM and non-breaking space.
		*/
		return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	};
}
