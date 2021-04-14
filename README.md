# 2D drawing tool to plan Minecraft projects

This is a tool to use textures as brushes. The textures you want to use should be defined in a JSON file (you may look at blocks.json or minecraft_1.16.json to see how it should be formatted). You can pass the path to the JSON file as a URL search parameter.

Unfortunately I can't share the vanilla Minecraft textures for copyright reasons, but if you have the game you can extract them into the "block/" folder. You can find the textures inside the minecraft.jar (use an archive manager to open or extract the file) in folder `/assets/minecraft/textures/block`. You can then use the provided `minecraft_1.16.json` file by renaming it to `blocks.json`, or by giving the json file name as a URL search parameter `blocks`. For example, if you are serving this on localhost on port 8080, you would navigate to "localhost:8080/?blocks=minecraft_1.16.json".
