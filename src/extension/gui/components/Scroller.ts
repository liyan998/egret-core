/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module egret.gui {


    /**
        * 适用Viewport的滑动类
        */
    class ViewportScroller extends egret.ScrollView {
        private _width: number = 0;
        private _height: number = 0;
        /**
            * @method egret.gui.GroupBase#constructor
            */
        public constructor(content: IViewport) {
            super(<DisplayObject><any>content);
        }

        public setContent(content:DisplayObject) { 
            super.setContent(content);
            var viewport: IViewport = <any>this._content;
            this._scrollLeft = viewport.horizontalScrollPosition;
            this._scrollTop = viewport.verticalScrollPosition;
        }

        public _updateContentPosition():void {
            var content: IViewport = <any>this._content;
            content.horizontalScrollPosition = this._scrollLeft;
            content.verticalScrollPosition = this._scrollTop;
            content.setLayoutBoundsSize(this._width, this._height);
            this.dispatchEvent(new Event(Event.CHANGE));
        }

        public getMaxScrollLeft():number {
            var content: IViewport = <any>this._content;
            var max = content.contentWidth - content.width;
            return Math.max(max, 0);
        }
        public getMaxScrollTop(): number {
            var content: IViewport = <any>this._content;
            var max = content.contentHeight - content.height;
            return Math.max(max, 0);
        }
        public _getContentWidth(): number {
            return (<any>this._content).contentWidth;
        }
        public _getContentHeight(): number {
            return (<any>this._content).contentHeight;
        }

        public _setHeight(value: number):void {
            this._height = value;
            var content: IViewport = <any>this._content;
            content.setLayoutBoundsSize(this._width, this._height);
        }

        public _setWidth(value:number):void { 
            this._width = value;
            var content: IViewport = <any>this._content;
            content.setLayoutBoundsSize(this._width, this._height);
        }
        public get height(): number {
            return this._height;
        }
        public set height(value: number) {
            this._setHeight(value);
        }

        public get width(): number {
            return this._width;
        }
        public set width(value:number) {
            this._setWidth(value);
        }

        public invalidateSize():void {
            var p = <UIComponent>this.parent;
            p && p.invalidateSize();
        }
        public invalidateDisplayList():void{
            var p = <UIComponent>this.parent;
            p&&p.invalidateDisplayList();
        }
    }
    
	/**
	 * @class egret.gui.Scroller
	 * @classdesc
	 * 滚动条组件
	 * @extends egret.gui.UIComponent
	 * @implements egret.gui.IVisualElementContainer
	 */	
    export class Scroller extends SkinnableComponent implements IVisualElementContainer{

        /**
         * 构造函数
		 * @method egret.gui.Scroller#constructor
         */
        public constructor(){
            super();
            
        }
        /**
		 * [SkinPart]水平滚动条
		 */		
        public horizontalScrollBar: HScrollBar;
		/**
		 * [SkinPart]垂直滚动条
		 */		
        public verticalScrollBar: VScrollBar;

        public _scroller: egret.ScrollView;

        /**
		 * @method egret.gui.Scroller#measure
         */
        public measure():void{
            if(!this._viewport)
                return;
            this.measuredWidth = this._viewport.preferredWidth;
            this.measuredHeight = this._viewport.preferredHeight;
        }
        /**
		 * @param unscaledWidth {number}
		 * @param unscaledHeight {number} 
         */
        public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
            this._scroller._setWidth(unscaledWidth);
            this._scroller._setHeight(unscaledHeight);
            if (this.horizontalScrollBar) {
                if (this._horizontalScrollPolicy != "off") {
                    this.horizontalScrollBar._setViewportMetric(unscaledWidth, this._viewport.contentWidth);
                    this.horizontalScrollBar._setWidth(unscaledWidth - 2);
                    this.horizontalScrollBar.x = 1;
                    this.horizontalScrollBar.y = unscaledHeight - this.horizontalScrollBar._height - 1;
                }
            }
            if (this.verticalScrollBar) {
                if (this._verticalScrollPolicy != "off") {
                    this.verticalScrollBar._setViewportMetric(unscaledHeight, this._viewport.contentHeight);
                    this.verticalScrollBar._setHeight(unscaledHeight - 2);
                    this.verticalScrollBar.y = 1;
                    this.verticalScrollBar.x = unscaledWidth - this.verticalScrollBar.width - 1;
                }
            }
        }

        private _verticalScrollPolicy:string = "auto";

        /**
         * 垂直滚动条显示策略，参见ScrollPolicy类定义的常量。
		 * @member egret.gui.Scroller#verticalScrollPolicy
         */
        public get verticalScrollPolicy():string
        {
            return this._verticalScrollPolicy;
        }

        public set verticalScrollPolicy(value: string) {
            if (value == this._verticalScrollPolicy)
                return;
            this._verticalScrollPolicy = value;
            this._checkVbar();
            if (this._scroller)
                this._scroller.verticalScrollPolicy = value;
        }

        private _horizontalScrollPolicy:string = "auto";

        /**
         * 水平滚动条显示策略，参见ScrollPolicy类定义的常量。
		 * @member egret.gui.Scroller#horizontalScrollPolicy
         */
        public get horizontalScrollPolicy():string
        {
            return this._horizontalScrollPolicy;
        }
        public set horizontalScrollPolicy(value: string) {
            if (value == this._horizontalScrollPolicy)
                return;
            this._horizontalScrollPolicy = value;
            this._checkHbar();
            if (this._scroller)
                this._scroller.horizontalScrollPolicy = value;
        }

        private _viewport:IViewport;

        /**
         * 要滚动的视域组件。
		 * @member egret.gui.Scroller#viewport
         */
        public get viewport():IViewport{
            return this._viewport;
        }
        public set viewport(value:IViewport){
            if (value == this._viewport)
                return;

            this.uninstallViewport();
            this._viewport = value;
            this.installViewport();
            this.dispatchEventWith("viewportChanged");
        }

        /**
         * 安装并初始化视域组件
         */
        private installViewport():void{
            var viewport:IViewport = this.viewport;
            if (this._scroller == null) {
                this._scroller = new ViewportScroller(viewport);
                this._scroller.horizontalScrollPolicy = this._horizontalScrollPolicy;
                this._scroller.verticalScrollPolicy = this._verticalScrollPolicy;
                this._scroller.addEventListener(egret.Event.CHANGE, this._scrollerChangedHandler, this);
                this._addToDisplayListAt(<DisplayObject><any> this._scroller, 0);
            }
            if (viewport){
                viewport.clipAndEnableScrolling = true;
                this._scroller.setContent(<DisplayObject><any>viewport);
                viewport.addEventListener(egret.gui.PropertyChangeEvent.PROPERTY_CHANGE, this._viewportChangedHandler, this);
                if("_addToStyleProtoChain" in viewport){
                    viewport["_addToStyleProtoChain"](this._styleProtoChain);
                }
            }
        }

        public _onAddToStage():void {
            super._onAddToStage();
            this._scroller._stage = this.stage;
        }
        /**
         * 卸载视域组件
         */
        private uninstallViewport():void{
            if (this.viewport){
                this.viewport.clipAndEnableScrolling = false;
                this.viewport.removeEventListener(egret.gui.PropertyChangeEvent.PROPERTY_CHANGE, this._viewportChangedHandler, this);
            }
            if (this._scroller) {
                this._scroller.removeContent();
            }
        }

        private _viewportChangedHandler(e: egret.gui.PropertyChangeEvent):void {
            if (e.property =="horizontalScrollPosition")
                this.setViewportHScrollPosition(this.viewport.horizontalScrollPosition);
            if (e.property == "verticalScrollPosition")
                this.setViewportVScrollPosition(this.viewport.verticalScrollPosition);
        }

        private _scrollerChangedHandler(e: Event) {
            this.setViewportHScrollPosition(this._scroller.scrollLeft);
            this.setViewportVScrollPosition(this._scroller.scrollTop);
        }

        private setViewportVScrollPosition(pos: number): void {
            if (this._scroller.scrollTop != pos)
                this._scroller.scrollTop = pos;
            if (this.verticalScrollBar && this.verticalScrollBar.value != pos)
                this.verticalScrollBar.setPosition(pos);
        }
        private setViewportHScrollPosition(pos: number): void {
            if (this._scroller.scrollLeft != pos)
                this._scroller.scrollLeft = pos;
            if (this.horizontalScrollBar&&this.horizontalScrollBar.value != pos)
                this.horizontalScrollBar._setValue(pos);
        }

        /**
         * 缓动到水平滚动位置
         * @method egret.gui.Scroller#throwHorizontally
         * @param hspTo {number} 
         * @param duration {number} 
         */
        public throwHorizontally(hspTo: number, duration: number= 500): void {
            if (!this._scroller)
                return;
            this._scroller.setScrollLeft(hspTo, duration);
        }
        /**
         * 缓动到垂直滚动位置
         * @method egret.gui.Scroller#throwVertically
         * @param vspTo {number} 
         * @param duration {number} 
         */
        public throwVertically(vspTo: number, duration: number= 500): void {
            if (!this._scroller)
                return;
            this._scroller.setScrollTop(vspTo, duration);
        }

		/**
		 * @member egret.gui.Scroller#numElements
		 */
        public get numElements():number{
            return this.viewport ? 1 : 0;
        }

        /**
         * 抛出索引越界异常
         */
        private throwRangeError(index:number):void{
            throw new RangeError("索引:\""+index+"\"超出可视元素索引范围");
        }
        /**
		 * @param index {number}
		 * @returns {IVisualElement}
         */
        public getElementAt(index:number):IVisualElement{
            if (this.viewport && index == 0)
                return this.viewport;
            else
                this.throwRangeError(index);
            return null;
        }

        /**
		 * @param element {IVisualElement}
		 * @returns {number}
         */
        public getElementIndex(element:IVisualElement):number{
            if (element != null && element == this.viewport)
                return 0;
            else
                return -1;
        }
        /**
		 * @param element {IVisualElement}
		 * @returns {boolean}
         */
        public containsElement(element:IVisualElement):boolean{
            if (element != null && element == this.viewport)
                return true;
            return false;
        }

        private throwNotSupportedError():void{
            throw new Error("此方法在Scroller组件内不可用!");
        }
        /**
         * @deprecated
		 * @param element {IVisualElement} 
		 * @returns {IVisualElement}
         */
        public addElement(element:IVisualElement):IVisualElement{
            this.throwNotSupportedError();
            return null;
        }
        /**
         * @deprecated
		 * @param element {IVisualElement} 
		 * @param index {number} 
		 * @returns {IVisualElement}
         */
        public addElementAt(element:IVisualElement, index:number):IVisualElement{
            this.throwNotSupportedError();
            return null;
        }
        /**
         * @deprecated
		 * @param element {IVisualElement} 
		 * @returns {IVisualElement}
         */
        public removeElement(element:IVisualElement):IVisualElement{
            this.throwNotSupportedError();
            return null;
        }
        /**
         * @deprecated
		 * @param index {number} 
		 * @returns {IVisualElement}
         */
        public removeElementAt(index:number):IVisualElement{
            this.throwNotSupportedError();
            return null;
        }
        /**
         * @deprecated
         */
        public removeAllElements():void{
            this.throwNotSupportedError();
        }
        /**
         * @deprecated
		 * @param element {IVisualElement} 
		 * @param index {number} 
         */
        public setElementIndex(element:IVisualElement, index:number):void{
            this.throwNotSupportedError();
        }
        /**
         * @deprecated
		 * @param element1 {IVisualElement} 
		 * @param element2 {IVisualElement} 
         */
        public swapElements(element1:IVisualElement, element2:IVisualElement):void{
            this.throwNotSupportedError();
        }
        /**
         * @deprecated
		 * @param index1 {number} 
		 * @param index2 {number} 
         */
        public swapElementsAt(index1:number, index2:number):void{
            this.throwNotSupportedError();
        }

        /**
         * @deprecated
		 * @param child {DisplayObject} 
		 * @returns {DisplayObject}
         */
        public addChild(child:DisplayObject):DisplayObject{
            this.throwNotSupportedError();
            return null;
        }
        /**
         * @deprecated
		 * @param child {DisplayObject} 
		 * @param index {number} 
		 * @returns {DisplayObject}
         */
        public addChildAt(child:DisplayObject, index:number):DisplayObject{
            this.throwNotSupportedError();
            return null;
        }
        /**
         * @deprecated
		 * @param child {DisplayObject} 
		 * @returns {DisplayObject}
         */
        public removeChild(child:DisplayObject):DisplayObject{
            this.throwNotSupportedError();
            return null;
        }
        /**
         * @deprecated
		 * @param index {number} 
		 * @returns {DisplayObject}
         */
        public removeChildAt(index:number):DisplayObject{
            this.throwNotSupportedError();
            return null;
        }
        /**
         * @deprecated
		 * @param child {DisplayObject} 
		 * @param index {number} 
         */
        public setChildIndex(child:DisplayObject, index:number):void{
            this.throwNotSupportedError();
        }
        /**
         * @deprecated
		 * @param child1 {DisplayObject} 
		 * @param child2 {DisplayObject} 
         */
        public swapChildren(child1:DisplayObject, child2:DisplayObject):void{
            this.throwNotSupportedError();
        }
        /**
         * @deprecated
		 * @param index1 {number} 
		 * @param index2 {number} 
         */
        public swapChildrenAt(index1:number, index2:number):void{
            this.throwNotSupportedError();
        }


        public _checkHbar(): void {
            if (this._horizontalScrollPolicy == "off") {
                if (this.horizontalScrollBar) {
                    this._removeFromDisplayList(this.horizontalScrollBar);
                }
                return;
            }
            var bar = this.horizontalScrollBar;
            bar.addEventListener(Event.CHANGE, this.hBarChanged, this, false);
            bar._setViewportMetric(this._viewport.width, this._viewport.contentWidth);
            this.horizontalScrollBar = bar;
            var host:any = bar.owner;
            if(host&&"removeElement" in host){
                (<IContainer> host).removeElement(bar);
            }
            this._addToDisplayList(this.horizontalScrollBar);
        }
        public _checkVbar(): void {
            if (this._verticalScrollPolicy == "off") {
                if (this.verticalScrollBar) {
                    this._removeFromDisplayList(this.verticalScrollBar);
                }
                return;
            }
            var vbar = this.verticalScrollBar;
            vbar.addEventListener(Event.CHANGE, this.vBarChanged, this, false);
            vbar._setViewportMetric(this._viewport.height, this._viewport.contentHeight);
            this.verticalScrollBar = vbar;
            var host:any = vbar.owner;
            if(host&&"removeElement" in host){
                (<IContainer> host).removeElement(vbar);
            }
            this._addToDisplayList(this.verticalScrollBar);
        }


        /**
         * 若皮肤是ISkin,则调用此方法附加皮肤中的公共部件
         * @param partName {string}
         * @param instance {any} 
         */
        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
            if (instance == this.horizontalScrollBar) {
                this._checkHbar();
            }
            if (instance == this.verticalScrollBar) {
                this._checkVbar();
            }
        }

        public _removeScrollBars(): void {
            if (this.horizontalScrollBar) {
                this._removeFromDisplayList(this.horizontalScrollBar);
                this.horizontalScrollBar.removeEventListener(Event.CHANGE, this.hBarChanged, this, false);
                this.horizontalScrollBar = null;
            }
            if (this.verticalScrollBar) {
                this._removeFromDisplayList(this.verticalScrollBar);
                this.verticalScrollBar.removeEventListener(Event.CHANGE, this.vBarChanged, this, false);
                this.verticalScrollBar = null;
            }
        }

        private hBarChanged(e: Event): void {
            this.setViewportHScrollPosition(this.horizontalScrollBar._getValue());
        }
        private vBarChanged(e: Event): void {
            this.setViewportVScrollPosition(this.verticalScrollBar.getPosition());
        }

        public _createOwnStyleProtoChain(chain:any):void{
            chain = super._createOwnStyleProtoChain(chain);
            var viewport:IViewport = this._viewport;
            if(viewport&&"_addToStyleProtoChain" in viewport){
                viewport["_addToStyleProtoChain"](chain);
            }
            return chain;
        }
        /**
         * 添加到父级容器的样式原型链
         */
        public regenerateStyleCache(parentChain:any):void{
            super.regenerateStyleCache(parentChain);
            var viewport:IViewport = this._viewport;
            if(viewport&&"regenerateStyleCache" in viewport){
                viewport["regenerateStyleCache"](parentChain);
            }
        }

        /**
         * 通知项列表样式发生改变
         */
        public notifyStyleChangeInChildren(styleProp:string):void{
            super.notifyStyleChangeInChildren(styleProp);
            var viewport:IViewport = this._viewport;
            if(viewport&&"styleChanged" in viewport){
                viewport["styleChanged"](styleProp);
                viewport["notifyStyleChangeInChildren"](styleProp);
            }
        }
    }

}