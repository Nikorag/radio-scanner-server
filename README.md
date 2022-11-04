# Radio Scanner Server
## Supported Architectures
Simply pulling  `nikorag/radio-scanner-server:latest`  should retrieve the correct image for your arch, but you can also pull specific arch images via tags.

The architectures supported by this image are:
|Architecture|Available|Tag|
|--|--|--|
|armv7|✅|latest|
## Usage
Here are some example snippets to help you get started creating a container
**docker cli**
```
docker run -d \
-p 3000:3000 \
--name=radio-scanner-server \
-v <pathToCsv>:/radio-scanner-server/ChannelList.csv \
nikorag/radio-scanner-server:local
```

**docker-compose**
```
version: "2.1"
services:
radio-scanner-server:
	image: nikorag/radio-scanner-server:local
	container_name: radio-scanner-server
	volumes:
		- <pathToCsv>:/radio-scanner-server/ChannelList.csv
	ports:
		- 3000:3000
	restart: unless-stopped
```
