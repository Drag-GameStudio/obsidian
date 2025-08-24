import g4f
import g4f.Provider
from g4f import Client
import time



class GPT:
    def __init__(self, provider=g4f.Provider.AnyProvider, gpt_models: str = ["PollinationsAI:openai-large", "PollinationsAI:openai"]): # for test we have PollinationsAI:openai
        self.client = Client(
            provider=provider,
        )
        self.gpt_models = gpt_models


    def check_sponsor(self, answer):
        cenzure_answer = answer
        sponsor_index = answer.find("**Sponsor**")

        if sponsor_index != -1:
            cenzure_answer = answer[:sponsor_index]


        link_index = cenzure_answer.find("https://pollinations.ai")
        if link_index != -1:
            cenzure_answer = cenzure_answer[:link_index]


        return cenzure_answer


    def get_answer_without_history(self, prompt):
        c_of_iter = 2
        for i in range(c_of_iter * len(self.gpt_models)):
            try:
                response = self.client.chat.completions.create(
                    model=self.gpt_models[i // c_of_iter],
                    messages=[{"role": "system", "content": "Это заметки человека, тебе нужно дать по ним коментарий длиною до 200 симвалов"}, {"role": "user", "content": prompt}]
                )

                break

            except Exception as e:
                print(e)
                time.sleep(5)
            
        else:
            return None
       
        answer = response.choices[0].message.content
        answer = self.check_sponsor(answer)


        return answer

def gpt_think(content):
    gpt = GPT()
    answer = gpt.get_answer_without_history(content)
    return f"GPT: {answer}"