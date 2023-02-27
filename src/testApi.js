import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `假如有一个科研小白，在读科研论文的时候遇到了一个难懂的专业术语，请你给他一个与文章有关的详细解释，关键字所在段落如下:\n\n目前进行正则表达式匹配的典型工具DFA和NFA都存在匹配效率和内存需求之间不可调和的矛盾,无法胜任网络安全检测中大规模正则表达式的匹配.为了解决这个问题,文中从网络安全检测的行为特点出发,结合DFA、NFA模型各自的特性,提出了一种基于猜测-验证的匹配方法.首先使用DFA对正则表达式中的部分子特征进行搜索,完成特征存在性的猜测;当猜测到有可能匹配某个特征后,再使用NFA进行验证.文中方法既充分利用了DFA的高效性,减少了对相对较慢的验证过程的调用,又借助NFA避免了内存消耗过于巨大.结果表明,该方法可以在大大减少内存需求的情况下,实现正则表达式的高效匹配.\n关键字：NFA\n解释：`,
    temperature: 0.7,
    max_tokens: 1212,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  }).then((response)=>{
    console.log("response :",response.data.choices[0].text)
  });