var blocks = []
var bWidth, bHeight;
var defaultBlock = "block/oak_log_top.png"
var currentBlock = document.getElementById("currentBlock")
var canvas = document.getElementById("drawArea")
var ctx = canvas.getContext("2d");

var url = new URL(window.location.href)
var blocksJson = url.searchParams.get("blocks") || "blocks.json"
fetch(blocksJson)
    .then(resp => resp.json())
    .then(data => {
        bWidth = data.width
        bHeight = data.height
        defaultBlock = data.default
        setCurrentBlock(defaultBlock)
        data.blocks.forEach(addBlock)
        data.favorites.forEach(addRecent)
        document.getElementById("currentBlock").addEventListener("load", ev => {
            if (!blocks.includes(currentBlock.src)) { blocks.push(currentBlock.src) }
        })
    })

function addBlock(blockUrl) {
    blocks.push(blockUrl)

    var opt = document.createElement("option")
    opt.value = blockUrl
    document.getElementById("blocks").appendChild(opt)

    var img = document.createElement("img")
    var blockName = blockUrl.split("/").pop().split(".")[0]
    img.classList.add("block")
    img.src = blockUrl
    img.alt = blockName
    img.title = blockName
    img.addEventListener("click", (ev) => {
        setCurrentBlock(ev.target.src)
        var recents = document.getElementById("recents")
        recents.removeChild(recents.lastChild)
        addRecent(ev.target.src)
    })
    document.getElementById("pallette").appendChild(img)
}

function addRecent(blockUrl) {
    var img = document.createElement("img")
    var blockName = blockUrl.split("/").pop().split(".")[0]
    img.classList.add("block")
    img.src = blockUrl
    img.alt = blockName
    img.title = blockName
    img.addEventListener("click", (ev) => {
        setCurrentBlock(ev.target.src)
    })
    document.getElementById("recents").prepend(img)
}

function setCurrentBlock(src) {
    var blockName = src.split("/").pop().split(".")[0]
    currentBlock.src = src
    currentBlock.alt = blockName
    currentBlock.title = blockName
    // don't set cursor if the image is not of the right size
    if (currentBlock.naturalHeight == bHeight && currentBlock.naturalWidth == bWidth) {
        var halfWidth = parseInt(bWidth / 2)
        var halfHeight = parseInt(bHeight / 2)
        canvas.style.cursor = "url('" + src + "') " + halfWidth + " " + halfHeight + ", auto"
        console.log("cursor set to: \n%s", canvas.style.cursor)
    } else {
        canvas.style.cursor = "crosshair"
    }
}

function getMousePos(cv, ev) {
    var rect = cv.getBoundingClientRect()
    return {
        x: ev.clientX - rect.left,
        y: ev.clientY - rect.top
    }
}

canvas.addEventListener("mousedown", ev => {
    var pos = getMousePos(canvas, ev)
    var dx = pos.x - (pos.x % bWidth)
    var dy = pos.y - (pos.y % bHeight)
    // only (bWidth x bHeight) part of the image will be drawn if it is too big
    ctx.drawImage(currentBlock, 0, 0, bWidth, bHeight, dx, dy, bWidth, bHeight)
    canvas.onmousemove = (ev) => {
        var pos = getMousePos(canvas, ev)
        var dx = pos.x - (pos.x % bWidth)
        var dy = pos.y - (pos.y % bHeight)
        ctx.drawImage(currentBlock, 0, 0, bWidth, bHeight, dx, dy, bWidth, bHeight)
    }
})

document.addEventListener("mouseup", ev => { canvas.onmousemove = null })

document.getElementById("searchBlockForm").addEventListener("submit", ev => {
    var val = document.getElementById("searchBlock").value
    document.getElementById("searchBlock").value = ""
    if (val) {
        setCurrentBlock(val)
        if (!blocks.includes(val)) {
            addBlock(val)
        }
    }
    ev.preventDefault()
})

document.getElementById("currentBlock").addEventListener("error", err => {
    alert("couldn't fetch image from url '" + currentBlock.src + "'(changing back to default block)")
    setCurrentBlock(defaultBlock)
})
