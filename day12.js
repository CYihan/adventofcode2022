import fs from 'fs'

fs.readFile('input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    solve(data)
})


const solve = (input) => {
    //console.log(input)

    const graphVertices = {}

    const graph = {}
    const heatMap = input.split('\n')

    heatMap.forEach((line, r) => {
        line.split('').forEach((p, c) => {
            graphVertices [(c + 1) + 'x' + (r + 1) + 'y'] = p
        })

    })

    let startKey = ''
    let endKey = ''

    for (const graphVerticesKey in graphVertices) {
        const graphNodeVal = graphVertices[graphVerticesKey]
        if (graphNodeVal === 'S') {
            startKey = graphVerticesKey
            graphVertices[graphVerticesKey]='a'
        }
        if (graphNodeVal === 'E') {
            endKey = graphVerticesKey
            graphVertices[graphVerticesKey]='z'
        }

    }

    for (const graphVerticesKey in graphVertices) {
        const graphNodeVal = graphVertices[graphVerticesKey]

        //const nodeCoords = [graphVerticesKey[0], graphVerticesKey[1]]

        //[up, down, left, right]
        const directionCoords =
            [
                [parseInt(graphVerticesKey.split('x')[0]), parseInt(graphVerticesKey.split('x')[1].split('y')[0]) + 1],
                [parseInt(graphVerticesKey.split('x')[0]), parseInt(graphVerticesKey.split('x')[1].split('y')[0]) - 1],
                [parseInt(graphVerticesKey.split('x')[0]) + 1, parseInt(graphVerticesKey.split('x')[1].split('y')[0])],
                [parseInt(graphVerticesKey.split('x')[0]) - 1, parseInt(graphVerticesKey.split('x')[1].split('y')[0])],
            ]


        directionCoords.forEach(dir => {
            //console.log(dir)

            const neighbourCoord = dir[0] + 'x' + dir[1] + 'y'
            /*  console.log(neighbourCoord )*/
            /*            console.log(!graphVertices[neighbourCoord])*/
            if (!graphVertices[neighbourCoord]) return
            /*console.log(!graphVertices[neighbourCoord].charCodeAt(0) - graphNodeVal.charCodeAt(0) <= 1)*/

            const currHeight = graphNodeVal.charCodeAt(0)
            const futureHeight = graphVertices[neighbourCoord].charCodeAt(0)

            //console.log(futureHeight - currHeight <= 1)

            /*            if (graphNodeVal === 'E') {
                            console.log(currHeight)
                            console.log(futureHeight)
                        }*/
            if (!(futureHeight - currHeight <= 1)) return


            const graphEdge = graph[graphVerticesKey] ? graph[graphVerticesKey] : {}


            graphEdge[neighbourCoord] = 1
            graph[graphVerticesKey] = graphEdge
        })
    }

    // gotten from: https://github.com/noamsauerutley/shortest-path
    const shortestDistanceNode = (distances, visited) => {
        let shortest = null;

        for (let node in distances) {
            let currentIsShortest =
                shortest === null || distances[node] < distances[shortest];
            if (currentIsShortest && !visited.includes(node)) {
                shortest = node;
            }
        }
        return shortest;
    };


    // gotten from: https://github.com/noamsauerutley/shortest-path
    const findShortestPathWithLogs = (graph, startNode, endNode) => {
        // establish object for recording distances from the start node
        let distances = {};
        distances[endNode] = "Infinity";
        distances = Object.assign(distances, graph[startNode]);

        // track paths
        let parents = { endNode: null };
        for (let child in graph[startNode]) {
            parents[child] = startNode;
        }

        // track nodes that have already been visited
        let visited = [];

        // find the nearest node
        let node = shortestDistanceNode(distances, visited);

        // for that node
        while (node) {
            // find its distance from the start node & its child nodes
            let distance = distances[node];
            let children = graph[node];
            // for each of those child nodes
            for (let child in children) {
                // make sure each child node is not the start node
                if (String(child) === String(startNode)) {
                    //console.log("don't return to the start node! 🙅");
                    continue;
                } else {
                    //console.log("startNode: " + startNode);
                    //console.log("distance from node " + parents[node] + " to node " + node + ")");
                    //console.log("previous distance: " + distances[node]);
                    // save the distance from the start node to the child node
                    let newdistance = distance + children[child];
                    //console.log("new distance: " + newdistance);
                    // if there's no recorded distance from the start node to the child node in the distances object
                    // or if the recorded distance is shorter than the previously stored distance from the start node to the child node
                    // save the distance to the object
                    // record the path
                    if (!distances[child] || distances[child] > newdistance) {
                        distances[child] = newdistance;
                        parents[child] = node;
                        //console.log("distance + parents updated");
                    } else {
                       // console.log("not updating, because a shorter path already exists!");
                    }
                }
            }
            // move the node to the visited set
            visited.push(node);
            // move to the nearest neighbor node
            node = shortestDistanceNode(distances, visited);
        }

        // using the stored paths from start node to end node
        // record the shortest path
        let shortestPath = [endNode];
        let parent = parents[endNode];
        while (parent) {
            shortestPath.push(parent);
            parent = parents[parent];
        }
        shortestPath.reverse();

        // return the shortest path from start node to end node & its distance
        let results = {
            distance: distances[endNode],
            path: shortestPath,
        };

        return results;
    }

/*    console.time()
   const steps = findShortestPathWithLogs(graph, startKey, endKey)
    console.timeEnd()*/
    let minSteps = Infinity

        for (const graphVerticesKey in graphVertices) {
            //console.log(graphVerticesKey)
            if(graphVertices[graphVerticesKey] === 'b'){
                const dist = findShortestPathWithLogs(graph, graphVerticesKey, endKey).distance
                if(dist < minSteps) minSteps = dist
            }
        }

    console.log(minSteps)


}