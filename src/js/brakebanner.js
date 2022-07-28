class BrakeBanner {
	constructor(selector) {
		this.app = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0xffffff,
			resizeTo: window
		})
		document.querySelector(selector).appendChild(this.app.view)

		this.loader = new PIXI.Loader();
		this.stage = this.app.stage;
		this.souceArray = ['btn.png', 'btn_circle.png', 'brake_bike.png', 'brake_handlerbar.png', 'brake_lever.png', 'malu.png']
		this.addSouce('images');
		this.loader.load();//加载元素

		this.bikelever = null;//预留一个刹车的对象

		this.loader.onComplete.add(() => {
			this.show();
		})
	}
	addSouce(basePath, souceArray = this.souceArray) {//添加资源
		for (const name of souceArray) {
			this.loader.add(name, `${basePath}/${name}`);
		}
	}
	show() {//显示
		let road = this.roadContainer()
		let bike = this.createBike();
		let particles = this.createParticleContainer()
		let actionButton = this.createActionButton()
		actionButton.x = window.innerWidth * 0.4;
		actionButton.y = window.innerHeight * 0.5;
		console.log(actionButton.interActive, actionButton.interactiveChildren)
		actionButton.interactive = true;
		actionButton.buttonMode = true;//更改cursor 亦可借助actionButton.cursor = 'wait';更改

		actionButton.on('pointerdown', (e) => {//桌面端移动端兼容的鼠标按下事件
			gsap.to(this.bikelever, { duration: 0.4, rotation: Math.PI / 180 * -35, repeat: 0 });
			gsap.to(bike, { duration: 0.3, x: bike.x - 20, y: bike.y + 20, repeat: 0 });
			particles.pause();
			road.pause();
		})
		actionButton.on('pointerup', (e) => {//桌面端移动端兼容的鼠标抬起事件
			gsap.to(this.bikelever, { duration: 0.4, rotation: 0, repeat: 0 });
			gsap.to(bike, { duration: 0.3, x: bike.x + 20, y: bike.y - 20, repeat: 0 });
			particles.start();
			road.start()
		})

		let resize = () => {
			bike.x = window.innerWidth - bike.width + 20;//使窗口变化后自行车依然保持在右侧
			bike.y = window.innerHeight - bike.height;
		}
		window.addEventListener('resize', resize)
		resize();
	}
	getResources(name) {//获得元素内容
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
		bikeimage.tint = 0x05AFF2; // 给自行车着色 需要注意的是，着色是在原色彩基础上混合颜色而不是覆盖颜色
		bikeHandbar.tint = 0x94E1F2; 
		bikelever.tint = 0x0442BF; 

		bikelever.pivot.x = bikelever.pivot.y = 455;
		bikelever.x = 772;
		bikelever.y = 900;

		bikeContainer.addChild(bikeimage)
		bikeContainer.addChild(bikelever)
		bikeContainer.addChild(bikeHandbar)//后添加以显示在内部

		return bikeContainer
	}
	createParticleContainer() {
		let container = new PIXI.Container();
		this.stage.addChild(container);
		let particles = [];
		const color = [0xf1cf54, 0xb5cea8, 0xf1cf54, 0x818cf6]
		for (let i = 0; i < 12; i++) {
			let gr = new PIXI.Graphics();
			gr.beginFill(color[Math.floor(Math.random() * color.length)]);
			gr.drawCircle(0, 0, 6)
			gr.endFill();
			let pitem = {
				sx: i * 0.08 * window.innerWidth,
				sy: Math.random() * window.innerHeight,
				gr: gr
			}
			gr.x = pitem.sx,
				gr.y = pitem.sy;
			container.addChild(gr);
			particles.push(pitem)
		}
		let speed = 0;
		function loop() {
			speed += .5;
			speed = Math.min(speed, 20)
			for (let i = 0; i < particles.length; i++) {
				const element = particles[i];
				element.gr.y += speed;
				if (speed >= 20) {
					element.gr.scale.y = 40;
					element.gr.scale.x = 0.03;
				}
				if (element.gr.y > window.innerHeight) element.gr.y = 0
			}
		}

		container.pivot.x = container.x = window.innerWidth / 2;
		container.pivot.y = container.y = window.innerHeight / 2;
		container.rotation = 32 * Math.PI / 180
		function start() {
			speed = 0;
			gsap.ticker.add(loop);
		}
		function pause() {
			gsap.ticker.remove(loop);
			for (let i = 0; i < particles.length; i++) {
				const element = particles[i];
				element.gr.scale.y = 1;
				element.gr.scale.x = 1;
				gsap.to(element.gr, { duration: .5, x: element.sx, y: element.sy, ease: 'elastic.out' });
			}
		}
		start();

		return {
			pause,
			start
		}
	}
	roadContainer() {
		let container = new PIXI.Container();
		this.stage.addChild(container);
		let roadImage = this.getResources('malu.png');
		container.addChild(roadImage)
		container.pivot.x = window.innerWidth / 2;
		container.pivot.y = window.innerHeight / 2;
		let sy = container.y = -800;
		let sx = container.x = 1000;
		container.scale.x = container.scale.y = 1.45
		//旋转位置使其与车轮平行
		container.rotation = 35 * Math.PI / 180;

		let speed = 0
		function Rloop() {
			speed += .5;
			speed = Math.min(speed, 20)
			//计算改变Y
			container.y += (Math.cos(35 * Math.PI / 180)) * speed;
			//计算改变X
			container.x -= (Math.sin(35 * Math.PI / 180)) * speed;
			//超出重置
			if (container.y > 60) {
				container.y = sy, container.x = sx;
			}
		}
		function start() {
			speed = 0;
			gsap.ticker.add(Rloop);
		}
		function pause() {
			gsap.ticker.remove(Rloop);
			gsap.to(container, { duration: .5, x: container.x += (Math.sin(35 * Math.PI / 180)) * speed , y: container.y -= (Math.cos(35 * Math.PI / 180)) * speed, ease: 'elastic.out' });
		}
		start();

		return {
			pause,
			start
		}
	}
}