class BrakeBanner {
	constructor(selector) {
		this.app = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0xffffff,
		})
		// debugger
		document.querySelector(selector).appendChild(this.app.view)

		this.loader = new PIXI.Loader();
		this.stage = this.app.stage;
		this.souceArray = ['btn.png', 'btn_circle.png', 'brake_bike.png', 'brake_handlerbar.png', 'brake_lever.png']
		this.addSouce('images');
		this.loader.load();

		this.bikelever = null;//预留一个刹车的对象

		this.loader.onComplete.add(() => {
			this.show();
		})

	}

	addSouce(basePath, souceArray = this.souceArray) {
		for (const name of souceArray) {
			this.loader.add(name, `${basePath}/${name}`);
		}
	}
	show() {
		let bike = this.createBike();
		let actionButton = this.createActionButton()
		actionButton.x = actionButton.y = 400;
		console.log(actionButton.interActive, actionButton.interactiveChildren)
		actionButton.interactive = true;
		actionButton.buttonMode = true;//更改cursor 亦可借助actionButton.cursor = 'wait';更改


		actionButton.on('pointerdown', (e) => {
			gsap.to(this.bikelever, { duration: 0.5, rotation: Math.PI / 180 * -35, repeat: 0 });

		})
		actionButton.on('pointerup', (e) => {
			gsap.to(this.bikelever, { duration: 0.5, rotation: 0, repeat: 0 });

		})

		let resize = () => {
			let bikeContainer.x = window.innerWidth - bikeContainer.width;
			let bikeContainer.y = window.innerHeight - bikeContainer.height;
		}
		window.addEventListener('resize', resize)
		resize();
	}
	getResources(name) {
		return new PIXI.Sprite(this.loader.resources[name].texture);
	}
	createActionButton() {
		let actionButton = new PIXI.Container();//初始化一个容器
		this.stage.addChild(actionButton);//将容器加载到stage中

		let btnImage = this.getResources('btn.png');
		let btnCircle = this.getResources('btn_circle.png');
		let btnCircle2 = this.getResources('btn_circle.png');

		actionButton.addChild(btnImage);//获得资源并加载
		actionButton.addChild(btnCircle);
		actionButton.addChild(btnCircle2);

		btnImage.pivot.x = btnImage.pivot.y = btnImage.width / 2;//使中心点从左上角更改为中心
		btnCircle.pivot.x = btnCircle.pivot.y = btnCircle.width / 2;
		btnCircle2.pivot.x = btnCircle2.pivot.y = btnCircle2.width / 2;

		btnCircle.scale.x = btnCircle.scale.y = 0.8;//设定初始缩放为0.8;
		btnCircle2.scale.x = btnCircle2.scale.y = 0.8//设定初始缩放为0.8;

		gsap.to(btnCircle.scale, { duration: 1, x: 1.3, y: 1.3, repeat: -1 });//设置动画为放大倍速到1.3并且无限重复
		gsap.to(btnCircle2.scale, { duration: 1, x: 1, y: 1, repeat: -1 });//设置动画为放大倍速到1.3并且无限重复
		gsap.to(btnCircle, { duration: 1, alpha: 0, repeat: -1 });//设置动画为逐渐消失

		return actionButton
	}
	createBike() {
		const bikeContainer = new PIXI.Container();
		this.stage.addChild(bikeContainer);
		bikeContainer.scale.x = bikeContainer.scale.y = 0.3;

		let bikeimage = this.getResources('brake_bike.png');
		let bikeHandbar = this.getResources('brake_handlerbar.png');
		let bikelever = this.getResources('brake_lever.png');
		this.bikelever = bikelever;//刹车挂载到this上

		bikelever.pivot.x = bikelever.pivot.y = 455;
		bikelever.x = 772;
		bikelever.y = 900;

		bikeContainer.addChild(bikeimage)
		bikeContainer.addChild(bikelever)
		bikeContainer.addChild(bikeHandbar)//后添加以显示在内部


		return bikeContainer
	}

}