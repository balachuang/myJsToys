// ref: https://miro.medium.com/v2/resize:fit:828/format:webp/1*IcXfj4JxzNh_ibxj4Sxf2w.png


class Dijkstra
{
	constructor(guiHandler) {
		this.guiHandler = guiHandler;
	};

	findBestPath(nodes, paths, maxPathValue)
	{
		// Initialization
		let minValue = [];
		let prevNode = [];
		for (let i=0; i<nodes.length; ++i)
		{
			minValue[i] = (i == 0) ? 0 : maxPathValue;
			prevNode[i] = -1;
		}

		// Start
		let confirmCount = 0;
		let currNode = 0;
		let currMinVal = maxPathValue;
		while (confirmCount < nodes.length)
		{
			// update minimum value of nodes that connect from current node
			for (let i=0; i<paths.length; ++i)
			{
				if (paths[i].nodeFrom != currNode) continue;

				let dist = minValue[paths[i].nodeFrom] + paths[i].value;
				if (minValue[paths[i].nodeTo] > dist)
				{
					minValue[paths[i].nodeTo] = dist;
					prevNode[paths[i].nodeTo] = paths[i].nodeFrom;
				}
			}

			// complete current node
			nodes[currNode].confirmed = true;
			confirmCount++;
			if (this.guiHandler != null) this.guiHandler(currNode);

			// find next un-confirmed node
			currMinVal = maxPathValue;
			for (let i=0; i<nodes.length; ++i)
			{
				if (nodes[i].confirmed) continue;
				if (minValue[i] < currMinVal)
				{
					currNode = i;
					currMinVal = minValue[i];
				}
			}
		}

		// All nodes are confirmed
		return prevNode;
	}
}
