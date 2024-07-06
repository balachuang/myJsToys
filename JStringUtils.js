class JStringUtils
{
	constructor() {}

	static isInvisible(str)
	{
		if (str == null) return true;
		if (str == undefined) return true;
		if (str.replace(/\s+/g, '') == '') return true;
	}

	static emptyIfNull(str)
	{
		return this.isInvisible(str) ? '' : str;
	}
}
