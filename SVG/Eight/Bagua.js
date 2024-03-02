// reference:
// https://en.wikipedia.org/wiki/Bagua

// 爻:
// 0 :: false :: 陰
// 1 :: true  :: 陽
const bgBar = [
	{ name: '陰', description: '' },
	{ name: '陽', description: '' }
];

// 八卦:
// 0 :: '坤' :: ☷ :: 地 :: 000
// 1 :: '艮' :: ☶ :: 山 :: 001
// 2 :: '坎' :: ☵ :: 水 :: 010
// 3 :: '巽' :: ☴ :: 風 :: 011
// 4 :: '震' :: ☳ :: 雷 :: 100
// 5 :: '離' :: ☲ :: 火 :: 101
// 6 :: '兌' :: ☱ :: 澤 :: 110
// 7 :: '乾' :: ☰ :: 天 :: 111
const bgTrigram = [
	{ name: '坤', symbol: '☷', represent: '地', bars: [0, 0, 0], description: '' },
	{ name: '艮', symbol: '☶', represent: '山', bars: [0, 0, 1], description: '' },
	{ name: '坎', symbol: '☵', represent: '水', bars: [0, 1, 0], description: '' },
	{ name: '巽', symbol: '☴', represent: '風', bars: [0, 1, 1], description: '' },
	{ name: '震', symbol: '☳', represent: '雷', bars: [1, 0, 0], description: '' },
	{ name: '離', symbol: '☲', represent: '火', bars: [1, 0, 1], description: '' },
	{ name: '兌', symbol: '☱', represent: '澤', bars: [1, 1, 0], description: '' },
	{ name: '乾', symbol: '☰', represent: '天', bars: [1, 1, 1], description: '' }
];

// 六十四卦
class BGTrigram2
{
	constructor(tri1Name, tri2Name)
	{
		this.trigram1 = null;
		this.trigram2 = null;
		this.name = '';
		this.description = '';

		this.setTrigramsByName(triName);
	}

	setTrigramsByName(triName)
	{
		switch(triName)
		{
		case '乾': // ☰ 天 111 7
			this.bars = [new BGBar(true), new BGBar(true), new BGBar(true)];
			this.name = '乾';
			this.description = '';
			break;
		case '兌': // ☱ 澤 110 6
			this.bars = [new BGBar(false), new BGBar(true), new BGBar(true)];
			this.name = '兌';
			this.description = '';
			break;
		case '離': // ☲ 火 101 5
			this.bars = [new BGBar(true), new BGBar(false), new BGBar(true)];
			this.name = '離';
			this.description = '';
			break;
		case '震': // ☳ 雷 100 4
			this.bars = [new BGBar(false), new BGBar(false), new BGBar(true)];
			this.name = '震';
			this.description = '';
			break;
		case '巽': // ☴ 風 011 3
			this.bars = [new BGBar(true), new BGBar(true), new BGBar(false)];
			this.name = '巽';
			this.description = '';
			break;
		case '坎': // ☵ 水 010 2
			this.bars = [new BGBar(false), new BGBar(true), new BGBar(false)];
			this.name = '坎';
			this.description = '';
			break;
		case '艮': // ☶ 山 001 1
			this.bars = [new BGBar(true), new BGBar(false), new BGBar(false)];
			this.name = '艮';
			this.description = '';
			break;
		case '坤': // ☷ 地 000 0
			this.bars = [new BGBar(false), new BGBar(false), new BGBar(false)];
			this.name = '坤';
			this.description = '';
			break;
		}
	}
}
