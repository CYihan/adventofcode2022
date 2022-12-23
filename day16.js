import fs from 'fs'

fs.readFile('input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    solve(data.split('\n'))
})


const solve = (input) => {

    const nodes = {}

    input.forEach(line => {
        //console.log(line)
        let regex = /([A-Z]{2})/g;
        let matches = line.match(regex);

        const key = matches.shift()

        regex = /flow rate=(\d+)/

        let flowMatches = line.match(regex)

        nodes[key] = {pathTo: matches, flow: flowMatches[1], key}

    })

    const graph = {}

    for (const k in nodes) {
        const node = nodes[k]

        const keys = node.pathTo
        keys.forEach((p => {
            if (!graph[k]) graph[k] = {}
            graph[k][p] = 1
        }))
    }


    const shortestDistanceNode = (distances, visited) => {
        let shortest = null;

        for (let node in distances) {
            let currentIsShortest = shortest === null || distances[node] < distances[shortest];
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
        let parents = {endNode: null};
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
            distance: distances[endNode], path: shortestPath,
        };

        return results;
    }


    const flowNodes = {}
    for (const p in nodes) {

        const checkNode = nodes[p]

        if (checkNode.flow > 0) {
            flowNodes[p] = checkNode

        }

    }

    flowNodes['AA'] = nodes['AA']


    const reducedGraph = {}

    const extendedGraph = {}

    for (const p in flowNodes) {
        const node = flowNodes[p]
        for (const k in flowNodes) {
            const compareNode = nodes[k]

            const distances = findShortestPathWithLogs(graph, node.key, compareNode.key)

            if (distances.distance === 'Infinity') continue

            reducedGraph[p] = reducedGraph[p] ? reducedGraph[p] : {}
            extendedGraph[p] = extendedGraph[p] ? extendedGraph[p] : {}
            reducedGraph[p][k] = distances.distance
            extendedGraph[p][k] = distances.path
        }
    }


    const startNode = nodes['AA']


    let maxScore = 0
    let maxVisited = []

    const visitedMap = {}


    recursiveSearch(startNode, 26, [])

    function recursiveSearch(node, timeRemain, visited) {
        let _visited = [...visited]
        _visited.push(node.key)
        const reducedGraphNode = reducedGraph[node.key]
        let newTr = 0
        for (const k in reducedGraphNode) {

            if (_visited.includes(k)) {
                continue
            }
            const dist = reducedGraphNode[k]
            newTr = timeRemain - (dist + 1)
            if (newTr < 0) {
                continue
            }
            recursiveSearch(nodes[k], newTr, [..._visited])

        }

        const score = calculateScore(_visited)


        const sortedKey = JSON.stringify(_visited.slice(1).sort())

        if (!visitedMap[sortedKey] || visitedMap[sortedKey].score < score) {
            visitedMap[sortedKey] = {score, original: _visited.slice(1)}
        }

        if (score > maxScore) {
            maxScore = score
            maxVisited = _visited
        }


    }

    //console.log(visitedMap)

    console.log(maxScore)
    console.log('visitedMap Length: ', Object.keys(visitedMap).length)

    const newVisitedMap = {}

    for (const k in visitedMap) {
        const node = visitedMap[k]

        newVisitedMap[JSON.stringify(node.original)] = node.score

    }


    //console.log(visitedMap)

    const calculateScoreSum = (obj) => {

        const keys = Object.keys(obj);
        console.time()
        for (let i = 0; i < keys.length; i++) {
/*            if (i % 45 === 0) {
                console.timeEnd()
                console.time()
            }*/
            const key1 = keys[i];
            const array1 = JSON.parse(key1)
            if (array1.length < 1) continue

            for (let j = i + 1; j < keys.length; j++) {
                const key2 = keys[j];
                const array2 = JSON.parse(key2)
                if (array2.length < 1) continue
                const overlap = array1.filter(x => array2.includes(x));
                if (overlap.length === 0) {
                    const score1 = newVisitedMap[key1];
                    const score2 = newVisitedMap[key2];

                    if (newMaxScore < score1 + score2) newMaxScore = score1 + score2
                }
            }
        }
    }

    let newMaxScore = 0


    calculateScoreSum(newVisitedMap)


    console.log(newMaxScore)
    console.timeEnd()


    function calculateScore(visited) {
        const score = visited.reduce((acc, v) => {

            if (v === 'AA') return acc

            const NextNode = nodes[v]
            const prevNode = nodes[acc[3]]
            const currPressure = acc[1]
            const currFlow = acc[2]
            const time = acc[0]
            const distance = reducedGraph[prevNode.key][NextNode.key] + 1

            const newPressure = currPressure + currFlow * distance
            const newFlow = currFlow + parseInt(NextNode.flow)
            const newTime = time - distance


            return [newTime, newPressure, newFlow, NextNode.key]

        }, [26, 0, 0, 'AA'])

        return score[1] + score[2] * score[0]
    }
}
