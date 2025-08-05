---
layout: post
title: "Zašto sam prešao na kineski AI (i zašto ćeš i ti)"
description: Kineski AI modeli revolucionišu programiranje, od cenovnih šokova do praktičnih rešenja
date: 2025-08-04
author: nikola
categories: [AI, Programming]
tags: [qwen3, chat-gpt, glm, kimi-2, deepseek, open-source, vs-code, comet-api, china-ai]
pin: false
math: true
comments: true
image:
  path: https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?q=80&w=996&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
  alt: Photo by <a href='https://unsplash.com/@omilaev?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash'>Igor Omilaev</a> on <a href='https://unsplash.com/photos/a-computer-chip-with-the-letter-a-on-top-of-it-eGGFZ5X2LnA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash'>Unsplash</a>
---

*(Tekst je ažuriran sa stanjem 1. avgusta 2025. godine)*

## Tihi zemljotres u AI industriji

Kada API poziv košta manje od kafe, a rezultat je analiza celog repozitorijuma, znate da se nešto promenilo.

Ono što se desilo krajem jula 2025. godine predstavlja pravi zaokret. Kineske AI labaratorije nisu samo objavili nove modele koji u potpunosti konkurišu Zapadnim, oni su fundamentalno redefinisali ekonomiju veštačke inteligencije za programere širom sveta.

Sa prijateljima često razgovaram o kineskom uspehu u poljima auto industrije, arhitekture i nauke, ali ovog puta sam ostao zapanjen njihovim dostignućima u polju veštačke inteligencije. Naime, u samo nedelju dana, objavljena su tri, kineska modela koji su pomerili lestvicu *state-of-art* open source modela. Kimi K2, Qwen3 i GLM 4.5.

### Cenovni šok koji menja sve

Brojke govore jasnu priču o promenama koje se odvijaju pred našim očima. 
Kineski AI modeli su znatno jeftiniji od zapadnih. DeepSeek V3 košta **30 puta manje** od GPT-4o, Qwen3-480B nudi GPT-4 performanse za 0.24 dolara, a GLM-4.5 drži rekord sa cenom od samo 0.11 dolara po milionu tokena[^1][^2][^2a][^2b][^3].

[^1]: [https://research.aimultiple.com/llm-pricing/](https://research.aimultiple.com/llm-pricing/)
[^1a]: [https://platform.openai.com/docs/pricing](https://platform.openai.com/docs/pricing)
[^2]: [https://huggingface.co/Qwen/Qwen3-Coder-480B-A35B-Instruct](https://huggingface.co/Qwen/Qwen3-Coder-480B-A35B-Instruct)
[^2a]: [https://www.scmp.com/tech/big-tech/article/3318747/how-chinas-open-source-ai-helping-deepseek-alibaba-take-silicon-valley](https://www.scmp.com/tech/big-tech/article/3318747/how-chinas-open-source-ai-helping-deepseek-alibaba-take-silicon-valley)
[^2b]: [https://huggingface.co/zai-org/GLM-4.5](https://huggingface.co/zai-org/GLM-4.5)
[^3]: [https://www.cnbc.com/2025/07/28/chinas-latest-ai-model-claims-to-be-even-cheaper-to-use-than-deepseek.html](https://www.cnbc.com/2025/07/28/chinas-latest-ai-model-claims-to-be-even-cheaper-to-use-than-deepseek.html)

**ovde cu dodati neki chart za cene**

Ova cenovna revolucija nije slučajnost. To što Kina sprovodi potpunu demokratizaciju AI tehnologije, to je rezultat sistemskog pristupa. Za razliku od zatvorenih, vlasničkih modela koji dominiraju Zapadom, kineski pristup počiva na **potpunoj otvorenosti**, source kod, težine modela, čak i podaci za treniranje su javno dostupni. Ovo znači da možete besplatno koristiti ove modele, ukoliko imate snažan računar. 

Besplatan model od 480 milijardi parametara zvuči kao poklon. Ali šta ako je i alat i mamac?

Omogućavajući programerima širom sveta da grade na njihovim sistemima, Kina potencijalno uspostavlja kineske modele kao globalne standarde.

## Kako sam pokrenuo jedan od najvećih LLM modela: Qwen3

Posle nedelju dana testiranja, moram da priznam da je ovo *game changer*. Evo kako sam to uradio, korak po korak.

**Prvo, realnost check:**
Zaboravi lokalno pokretanje. Pokušao sam sa LLaMA 3 (8B parametara) na svom računaru i jedva se izvukao. Qwen3 ima 480B parametara. Računica je brutalna.

**Šta stvarno radiš:**
Koristiš API, kao što koristiš GitHub ili AWS. Razlika je što je ovo kineski servis koji košta 30x manje od GPT-4.

### Setup koji mi je radio:

**1. Node.js**
```bash
# Ako nemaš Node 20+, skini ga
node --version  # proveri verziju

# Instaliraj Qwen CLI
npm install -g @qwen-code/qwen-code
```

**2. API deo (malo dosadan, ali mora)**
- Otvori [CometAPI.com](https://cometapi.com) 
- Registruj se (daju ti $0.10 za testiranje)
- Uzmi API key iz dashboard-a
- Eksportuj varijable:

```bash
export OPENAI_API_KEY="tvoj_key_ovde"
export OPENAI_BASE_URL="https://api.cometapi.com/v1"
export OPENAI_MODEL="qwen3-coder-plus"
```

**3. Test koji me je uverio:**
```bash
qwen
> Analiziraj @./src/  # pokazao mi je sve što sam zaboravio u kodu
```
**Proveri i Google-ov Gemini CLI, nad kojim je Qwen Code CLI nadograđen. Google nudi besplatne tokene.**[^4]

[^4]:[https://github.com/google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)

### Bonus: Cline ekstenzija

Ako si kao ja i mrziš terminal za duže konverzacije, probaj [Cline](https://cline.bot/) u VS Code-u. Isti API, bolji interfejs. Instaliraš ekstenziju, uneseš iste podatke, i možeš da komuniciraš direktno u editoru.

**Moja preporuka:** Kreni sa CLI-jem da vidiš kako radi, zatim pređi na Cline za ozbiljne projekte.

## Zakjučak: Srpski programeri kao oni sa Silicon Valley

Ono što me zabrinjavava nije brzina ovih promena, već naša spremnost da ih razumemo. Dok se fokusiramo na tehnička čuda kineskih modela, pitanje koje postaje relevantno: Šta to ne vidimo?

Možda je prava priča ovde geopolitička. Kina demokratizuje AI ne iz humanosti, već da bi postavila svoju infrastrukturu kao globalni standard. Možda je priča u tome što srpski programeri, po prvi put u istoriji, imaju pristup *cutting-edge* tehnologiji istovremeno sa Silicon Valley.

Koja je vaša teorija?

