(function () {
    const SIZE_RECT = 100,
        COLOR_WIDTH_RECTS = 350, // ширина цвета (до какого числа в h доходить рандому)
        COLOR_WIDTH_CIRCLES = 50, // ширина цвета (до какого числа в h доходить рандому)
        SIZE_CIRCLE = 10,
        CIRCLE_DEEP = 3;
    let canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        base = new Base();

    function Base() {
        this.rects = [];
        this.lines = [];
        this.dragObject = {};
        this.communication = {};
        this.addRect = function (x, y) {
            if (x - SIZE_CIRCLE < 0 ||// если вышло за поле
                y - SIZE_CIRCLE < 0 ||
                x > canvas.width - (SIZE_RECT + SIZE_CIRCLE) ||
                y > canvas.height - (SIZE_RECT / 2 + SIZE_CIRCLE) || // или на территории другого ректа
                this.clickInRectRange(x + SIZE_RECT / 2, y + SIZE_RECT / 4)) return;
            this.rects.push(new Rect(x, y));
            this.draw();
        };
        this.draw = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            this.lines = [];
            for (let rect of this.rects) rect.draw();
            // рисуем все линии после прямоугольников, чтобы были сверху
            context.beginPath();
            for (let line in this.lines) {
                let middle = (this.lines[line].end.x - this.lines[line].begin.x) / 2;
                context.moveTo(this.lines[line].begin.x, this.lines[line].begin.y);
                context.bezierCurveTo(this.lines[line].begin.x + middle, this.lines[line].begin.y, this.lines[line].end.x - middle, this.lines[line].end.y, this.lines[line].end.x, this.lines[line].end.y);
                context.stroke();
            }
            context.closePath();
        };
        this.clickInRect = function (x, y) {
            for (let rect of this.rects) {
                if (x > rect.x - SIZE_CIRCLE / 2 &&
                    x < rect.x + SIZE_RECT + SIZE_CIRCLE / 2 &&
                    y > rect.y - SIZE_CIRCLE / 2 &&
                    y < rect.y + SIZE_RECT / 2 + SIZE_CIRCLE / 2) return rect.id;
            }
            return null;
        };
        this.clickInRectRange = function (x, y) {
            for (let rect of this.rects) {
                let rangeX = {
                        begin: rect.x - SIZE_RECT / 2 - SIZE_CIRCLE,
                        end: rect.x + SIZE_RECT * 1.5 + SIZE_CIRCLE
                    },
                    rangeY = {
                        begin: rect.y - SIZE_RECT / 4 - SIZE_CIRCLE,
                        end: rect.y + SIZE_RECT / 2 * 1.5 + SIZE_CIRCLE
                    };
                if (x > rangeX.begin &&
                    x < rangeX.end &&
                    y > rangeY.begin &&
                    y < rangeY.end) return true;
            }
            return false;
        };
        this.clickInCircle = function (x, y, id) {
            if (id === null) return;
            for (let circle in this.rects[id].circles) {
                if (x > this.rects[id].circles[circle].coords.x - SIZE_CIRCLE &&
                    x < this.rects[id].circles[circle].coords.x + SIZE_CIRCLE &&
                    y > this.rects[id].circles[circle].coords.y - SIZE_CIRCLE &&
                    y < this.rects[id].circles[circle].coords.y + SIZE_CIRCLE) return circle;
            }
            return null;
        };
        this.moveInOtherRectRange = function (id) {
            let rangeXMain = {
                    begin: this.rects[id].x - SIZE_CIRCLE / 2,
                    end: this.rects[id].x + SIZE_RECT + SIZE_CIRCLE / 2
                },
                rangeYMain = {
                    begin: this.rects[id].y - SIZE_CIRCLE / 2,
                    end: this.rects[id].y + SIZE_RECT / 2 + SIZE_CIRCLE / 2
                };
            for (let rect of this.rects) {
                if (rect.id === id) continue;
                let rangeXOther = {
                        begin: rect.x - SIZE_CIRCLE / 2,
                        end: rect.x + SIZE_RECT + SIZE_CIRCLE / 2
                    },
                    rangeYOther = {
                        begin: rect.y - SIZE_CIRCLE / 2,
                        end: rect.y + SIZE_RECT / 2 + SIZE_CIRCLE / 2
                    };
                if (((rangeYMain.begin <= rangeYOther.begin && rangeYMain.end > rangeYOther.begin) && // зашел сверху
                    (rangeXMain.begin <= rangeXOther.begin && rangeXMain.end > rangeXOther.begin ||
                        rangeXMain.end >= rangeXOther.end && rangeXMain.begin < rangeXOther.end)) ||
                    ((rangeYMain.end >= rangeYOther.end && rangeYMain.begin < rangeYOther.end) && // зашел снизу
                        (rangeXMain.begin <= rangeXOther.begin && rangeXMain.end > rangeXOther.begin ||
                            rangeXMain.end >= rangeXOther.end && rangeXMain.begin < rangeXOther.end))) return true;
            }
            return false;
        };
        let instanse = this;
        Base = function () {
            return instanse;
        };
    }

    Base.prototype.constructor = Base;

    function Rect(x, y) { // клетка
        this.x = x; // свойства положения
        this.y = y;
        this.colorRect = 'hsl(' + randomInteger(COLOR_WIDTH_CIRCLES, COLOR_WIDTH_RECTS) + ',70%,50%)';
        this.colorCircle = 'hsl(' + randomInteger(0, COLOR_WIDTH_CIRCLES) + ',70%,50%)';
        this.id = base.rects.length;
        this.circles = {
            0: {
                coords: {
                    x: 0,
                    y: 0
                },
                color: this.colorCircle
            },
            1: {
                coords: {
                    x: 0,
                    y: 0
                },
                color: this.colorCircle
            },
            2: {
                coords: {
                    x: 0,
                    y: 0
                },
                color: this.colorCircle
            },
            3: {
                coords: {
                    x: 0,
                    y: 0
                },
                color: this.colorCircle
            }
        };
        this.draw = function () { // метод рисования
            this.circles['0'].coords.x = this.x + SIZE_RECT / 2;
            this.circles['0'].coords.y = this.y + CIRCLE_DEEP;

            this.circles['1'].coords.x = this.x + SIZE_RECT - CIRCLE_DEEP;
            this.circles['1'].coords.y = this.y + SIZE_RECT / 4;

            this.circles['2'].coords.x = this.x + SIZE_RECT / 2;
            this.circles['2'].coords.y = this.y + SIZE_RECT / 2 - CIRCLE_DEEP;

            this.circles['3'].coords.x = this.x + CIRCLE_DEEP;
            this.circles['3'].coords.y = this.y + SIZE_RECT / 4;

            context.fillStyle = this.colorRect; // рисование в canvas
            context.fillRect(this.x, this.y, SIZE_RECT, SIZE_RECT / 2);
            for (let circle in this.circles) {
                context.beginPath();
                context.arc(this.circles[circle].coords.x, this.circles[circle].coords.y, SIZE_CIRCLE, 0, Math.PI * 2, false);
                context.closePath();
                context.fillStyle = this.circles[circle].color; // рисование в canvas
                context.fill();
                if (this.circles[circle].connected) {
                    // добавляем линию, если есть
                    base.lines.push({
                        begin: {
                            x: this.circles[circle].coords.x,
                            y: this.circles[circle].coords.y
                        },
                        end: {
                            x: this.circles[circle].connected.x,
                            y: this.circles[circle].connected.y
                        }
                    })
                }
            }
        };
    }

    Rect.prototype.constructor = Rect;

    window.addEventListener("load", function () {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
    });
    canvas.addEventListener("dblclick", function (event) {
        base.addRect(event.pageX - SIZE_RECT / 2, event.pageY - SIZE_RECT / 4)
    });
    canvas.addEventListener("mousedown", function (event) {
        let movedRect = base.clickInRect(event.pageX, event.pageY),
            commCircle = base.clickInCircle(event.pageX, event.pageY, movedRect);
        if (!base.rects[movedRect]) return;
        if (commCircle) {
            base.communication.elem = base.rects[movedRect];
            base.communication.circle = commCircle;
            base.communication.elem.circles[commCircle].color = '#000';
            base.communication.downX = event.pageX;
            base.communication.downY = event.pageY;
            return;
        }
        base.dragObject.elem = base.rects[movedRect];
        base.dragObject.downX = event.pageX;
        base.dragObject.downY = event.pageY;
        base.dragObject.color = base.dragObject.elem.colorRect;
        base.dragObject.dragOver = false;
    });
    window.addEventListener("mouseup", function (event) {
        if (!base.dragObject.elem && !base.communication.elem) return;
        if (base.dragObject.elem) {
            base.dragObject.elem.colorRect = base.dragObject.color;
            base.dragObject = {};
        }
        if (base.communication.elem) {
            let movedRect = base.clickInRect(event.pageX, event.pageY),
                commCircle = base.clickInCircle(event.pageX, event.pageY, movedRect);
            if (!commCircle || (Math.abs(base.communication.downX - event.pageX) < SIZE_CIRCLE && Math.abs(base.communication.downY - event.pageY) < SIZE_CIRCLE)) {
                base.communication.elem.circles[base.communication.circle].color = base.communication.elem.colorCircle;
                delete base.communication.elem.circles[base.communication.circle].connected;
            } else {
                base.communication.elem.circles[base.communication.circle].connected = base.rects[movedRect].circles[commCircle].coords;
            }
            base.communication = {};
        }
        base.draw();
    });
    window.addEventListener("mousemove", function (event) {
        if (!base.dragObject.elem && !base.communication.elem) return;
        if (base.communication.elem) {
            base.communication.elem.circles[base.communication.circle].connected = {
                x: event.pageX,
                y: event.pageY,
            };
            base.draw();
            return;
        }
        let newDownX = event.pageX,
            newDownY = event.pageY,
            d = {
                x: base.dragObject.downX - event.pageX,
                y: base.dragObject.downY - event.pageY
            };
        if (event.pageX < SIZE_RECT / 2 + SIZE_CIRCLE ||
            event.pageX > canvas.width - SIZE_RECT / 2 - SIZE_CIRCLE) {
            d.x = 0;
            newDownX = base.dragObject.downX;
        }
        if (event.pageY < SIZE_RECT / 4 + SIZE_CIRCLE ||
            event.pageY > canvas.height - SIZE_RECT / 4 - SIZE_CIRCLE) {
            d.y = 0;
            newDownY = base.dragObject.downY;
        }

        base.dragObject.elem.x -= d.x;
        base.dragObject.elem.y -= d.y;
        if (base.moveInOtherRectRange(base.dragObject.elem.id)) {
            base.dragObject.elem.x += d.x;
            base.dragObject.elem.y += d.y;
            base.dragObject.dragOver = true;
            return;
        }
        base.dragObject.downX = newDownX;
        base.dragObject.downY = newDownY;
        base.draw();
    });

    function randomInteger(min, max) {
        return Math.floor(min + Math.random() * (max + 1 - min));
    }
})();