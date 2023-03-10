const canvas = document.querySelector('canvas')
const scoreEl = document.querySelector('#scoreEl')
const c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const arrEn = ["../images/Ace.png", "../images/Katakuri.png"]
const colors = ["red", "green", "blue"]

class Player {
    constructor() {

        this.velocity = {
            x: 0,
            y: 0
        }
        this.roation = 0
        this.opacity = 1
        const image = new Image()
        image.src = "../images/Ace.png"
        image.onload = () => {
            const scale = 0.15
            this.image = image
            this.width = image.width * 0.3
            this.height = image.height * 0.3
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        if (this.position) {
            c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
            c.rotate(this.roation)
            c.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2)
        }

        if (this.position) {
            c.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            )
            c.restore()
        }
    }
    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
        }

    }
}
class Projectile {
    constructor({ position, velocity }, color) {
        this.position = position
        this.velocity = velocity
        this.radius = 5
        this.color = color
    }
    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

    }
}
class Praticle {
    constructor({ position, velocity, radius, color, fades }) {
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }
    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.fades)
            this.opacity -= 0.01
    }
}
class InvaderProjectile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.width = 3
        this.height = 10
    }
    draw() {
        c.fillStyle = 'white'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

    }
}


class Invader {
    constructor({ position }, invaderSprite) {

        this.velocity = {
            x: 0,
            y: 0
        }
        this.roation = 0
        const image = new Image()
        image.src = invaderSprite
        image.onload = () => {
            const scale = 0.15
            this.image = image
            this.width = image.width * 0.2
            this.height = image.height * 0.2
            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }

    draw() {
        if (this.position) {
            c.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            )
        }
    }
    update({ velocity }) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }

    }

    shoot(invaderProjectiles) {
        invaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }))
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 3,
            y: 0
        }
        this.invaders = []
        const columns = Math.floor(Math.random() * 10 + 2)
        const rows = Math.floor(Math.random() * 5 + 2)

        this.width = columns * 37
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                this.invaders.push(new Invader(
                    {
                        position:
                        {
                            x: i * 40,
                            y: j * 50
                        }
                    },
                    arrEn[Math.floor(Math.random() * 2)]
                ))
            }
        }
    }


    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.y = 0
        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }

    }
}
const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const praticles = []
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }

}
// player.draw()
let frames = 0
let randominterval = Math.floor(Math.random() * 500 + 500)
let game = {
    over: false,
    active: true
}
let score = 0
for (let i = 0; i < 100; i++) {
    praticles.push(new Praticle({
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },
        velocity: {
            x: 0,
            y: 0.6
        },
        radius: Math.random() * 2,
        color: 'white'
    }))
}
function createParticles({ object, color, fades }) {
    for (let i = 0; i < 15; i++) {
        praticles.push(new Praticle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 3,
            color: color || '#FF3371',
            fades
        }))
    }
}
function animate() {
    if (!game.active) {
        return
    }
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    // invader.update()
    player.update()
    praticles.forEach((particle, i) => {
        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius

        }
        if (particle.opacity <= 0) {
            setTimeout(() => {
                particle.splice(i, 1)
            }, 0)
        } else {
            particle.update()
        }
    })
    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0)
        } else invaderProjectile.update()
        if (invaderProjectile.position.y + invaderProjectile.height >= player.position.y
            && invaderProjectile.position.x + invaderProjectile.width >= player.position.x
            && invaderProjectile.position.x <= player.position.x + player.width) {
            console.log('you lose');
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
                player.opacity = 0
                game.over = true
            }, 0)
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
                game.active = false

            }, 2000)
            createParticles({
                object: player,
                color: 'red',
                fades: true
            })
        }
    })
    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <= 0) {
            // setTimeout(() => {
            projectiles.splice(index, 1)
            // }, 0)
        }
        else {
            projectile.update()
        }
    })

    // projectiles.forEach(projectile => {
    //     if (projectile.position.y <= 0) {
    //         projectiles.splice()
    //     }
    // })

    grids.forEach((grid, index) => {
        if (grid.invaders == 0) {
            grids.splice(index, 1)
        }
    })

    grids.forEach((grid, gridIndex) => {
        grid.update()
        //spawn projctiles 
        if (frames % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
        }
        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity })

            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >= invader.position.x &&
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y) {
                    setTimeout(() => {

                        const invaderFound = grid.invaders.find(invader2 => invader2 === invader)
                        const projectileFound = projectiles.find(projectile2 => projectile2 === projectile)
                        //remove invader and projectile
                        if (invaderFound && projectileFound) {
                            score += 100
                            scoreEl.innerHTML = score
                            createParticles({
                                object: invader,
                                fades: true
                            })
                            grid.invaders.splice(i, 1)
                            projectiles.splice(j, 1)
                            if (grid.invaders.length > 0) {
                                const firstIvader = grid.invaders[0];
                                const lastIvader = grid.invaders[grid.invaders.length - 1];
                                grid.width = lastIvader.position.x - firstIvader.position.x + lastIvader.width
                                grid.position.x = firstIvader.position.x

                            }
                            else
                                grid.splice(gridIndex, 1)
                        }
                    }, 0)
                }
            })
        })
    })

    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -7
        player.roation = -0.15
    } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 7
        player.roation = 0.15

    }
    else {
        player.velocity.x = 0
        player.roation = 0

    }
    //spawn enemies
    if (frames % randominterval === 0) {
        grids.push(new Grid())
        randominterval = Math.floor(Math.random() * 500 + 500)
        frames = 0
    }



    frames++
}
animate()

addEventListener('keydown', ({ key }) => {

    switch (key) {
        case 'ArrowLeft':
            // console.log(key);
            // console.log('left');
            keys.a.pressed = true
            break
        case 'ArrowRight':
            // console.log('right');
            keys.d.pressed = true
            break
        case ' ':
            // console.log('space');
            projectiles.push(
                new Projectile({
                    position: {
                        x: player.position.x + player.width / 2,
                        y: player.position.y
                    },
                    velocity: {
                        x: 0,
                        y: -10
                    }
                }
                    , colors[Math.floor(Math.random() * 3)]
                )
            )
            // console.log(projectiles)
            break
        case 'p':
            game.over = !game.over
            game.active = !game.active
            console.log('p');
            if(game.active){
                animate()
            }

            break
    }
})
addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'ArrowLeft':
            // console.log('left');
            keys.a.pressed = false
            break
        case 'ArrowRight':
            // console.log('right');
            keys.d.pressed = false
            break
        case ' ':
            // console.log('space');
            break

    }
})