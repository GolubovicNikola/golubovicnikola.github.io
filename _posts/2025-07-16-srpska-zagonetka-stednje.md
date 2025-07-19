---
layout: post
title: Da li domaćinstva u Srbiji zaista štede novac?
description: Štednja je gotovo umetnost i nacionalni sport u Srbiji, nastao iz potreba i iskustava prethodnih generacija.
date: 2025-07-17
author: nikola
categories: [Data Science, Economics]
tags: [data analysis, savings rate, Serbian economy]
pin: false
math: true
comments: true
image:
  path: https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
  alt: Photo by <a href='https://unsplash.com/@micheile?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash'>micheile henderson</a> on <a href='https://unsplash.com/photos/green-plant-in-clear-glass-vase-ZVprbBmT8QA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash'>Unsplash</a>
---

## Zagonetka štednje srpskih domaćinstava

U Srbiji postoje dve odvojene ekonomske realnosti. Pravo pitanje nije *da li* Srbija štedi, već *koji* deo Srbije jedini to uspeva, dok ostatak zemlje živi u minusu.

Nisam ekonomista. Po profesiji sam informatičar i moja strast je da koristim tehnologiju za rešavanje kompleksnih problema. Umesto da se oslanjam na ekonomske teorije i modele, moj pristup je direktniji: pustiti podatke da govore sami za sebe. 

Vođen ovom idejom zaronio sam u zvanične podatke Republičkog zavoda za statistiku o [prihodima](https://opendata.stat.gov.rs/data/WcfJsonRestService.Service1.svc/dataset/010101IND01/3/csv) i [rashodima](https://opendata.stat.gov.rs/data/WcfJsonRestService.Service1.svc/dataset/010201IND01/3/csv), i otkrio da je prosečna stopa štednje u Srbiji skromna i da je izuzetno osetljiva na ekonomske potrese, što se jasno vidi iz oštrog pada tokom krizne 2012. godine. 

U nastavku teksta, uz pomoć nekoliko linija **Python** koda, otkrivamo odgovor na tu, mnogo zanimljiviju, zagonetku.  

### Prvi nivo analize: Nacionalna slika

Osnovna jednačina je jednostavna: **Prihodi - Rashodi = Štednja**. Kada ovu razliku podelimo sa prihodima, dobijamo **stopu štednje** – ključni pokazatelj finansijskog zdravlja. Pogledajmo kako se ta stopa kretala tokom godina u urbanim naseljima Srbije. Iako sam koristio urbana, krajnji rezultat je isti i za ruralna naselja.

{% include_relative /_charts/savings_by_region.html %} 
Kompletan kod može se naći [ovde][github-repo] 🔗.
```python
import plotly.express as px
fig = px.line(merged_df, x='god', y='stopa_stednje', color='nTer_income',
              title='Štednja tokom godina po regionima',
              labels={'god': 'Godina', 'stopa_stednje': 'Stopa štednje (%)', 'nTer_income': 'Region'},
              markers=True)
fig.update_layout(xaxis_title='Godina', yaxis_title='Stopa štednje (%)')
fig.show()
```

Prvo što upada u oči je **dramatičan pad stope štednje u 2012. godini**. Ovaj pad nije slučajan. Ta godina je bila obeležena završetkom globalne finansijske krize iz 2008, čiji su efekti sa zakašnjenjem stigli do nas, ali i značajnom unutrašnjom neizvesnošću. Održani su parlamentarni i predsednički izbori koji su doneli **promenu vlasti**. Takvi periodi tranzicije i ekonomske neizvesnosti gotovo uvek utiču na poverenje i potrošača i privrede, što se jasno oslikava u sposobnosti domaćinstava da štede. Prihodi su stagnirali, dok su troškovi nastavili da rastu.

### Drugi nivo analize: Beograd protiv ostatka Srbije

Međutim, nacionalni prosek je samo deo priče. On često maskira fundamentalne razlike koje postoje unutar zemlje. Analiza prosečne stope štednje po regionima za poslednju dostupnu godinu (2024) otkriva jednu surovu istinu.

{% include_relative /_charts/savings_by_regions_last_year.html %}

```python
latest_year = merged_df['god'].max()
average_savings_by_region = merged_df[merged_df['god'] == latest_year].groupby('nTer_income')['stopa_stednje'].mean().reset_index()
fig = px.bar(average_savings_by_region, x='nTer_income', y='stopa_stednje',
             title=f'Prosečna stopa štednje po regionima u {latest_year}',
             labels={'nTer_income': 'Region', 'stopa_stednje': 'Prosečna stopa štednje (%)'},
             color='nTer_income')
fig.update_layout(yaxis_title='Prosečna stopa štednje (%)')
fig.show()
```
Podaci su neumoljivi: **jedino domaćinstva u Beogradskom regionu imaju pozitivnu stopu štednje**. Svi ostali regioni u Srbiji, u proseku, troše više nego što zarađuju. Ovo nije samo statistika; ovo je signal postojanja dve različite ekonomske realnosti unutar jedne države. Dok glavni grad uspeva da generiše višak, ostatak zemlje se bori sa pokrivanjem osnovnih troškova.

### Psihologija trošenja

Da bismo razumeli *zašto* postoji ova razlika, moramo pogledati na šta se novac troši. Fokusirali smo se na **neobavezne troškove** – one koji ostaju nakon što se plate hrana, računi i transport. Uporedili smo strukturu potrošnje u Beogradu sa susednim regionom, Šumadije i Zapadne Srbije.

{% include_relative /_charts/category_spendings.html %}

```python
pivot = df_out_tmp.pivot(index='nCOICOP', columns='nTer', values='vrednost')
pivot['diff'] = (pivot.max(axis=1) - pivot.min(axis=1)).abs()

# Prikazati kategorije u kojima je razlika osetna
filtered_categories = pivot[pivot['diff'] > 1.2].index 
filtered_df = df_out_tmp[df_out_tmp['nCOICOP'].isin(filtered_categories)]

fig = px.bar(
    filtered_df,
    x='nTer',
    y='vrednost',
    color='nCOICOP',
    barmode='group',
    title='Značajne razlike u potrošnji (Beograd vs. Šumadija i Zapadna Srbija) u 2024.',
    labels={'nTer': 'Region', 'vrednost': 'Udeo u potrošnji (%)', 'nCOICOP': 'Kategorija'}
)
fig.show()
```
Rezultati su fascinantni. U Beogradu se primetno veći deo budžeta odvaja za kategorije kao što su **"Rekreacija i kultura"** i **"Restorani i hoteli"**. U regionu Šumadije i Zapadne Srbije, veći udeo odlazi na **"Alkoholna pića i duvan"**.

Ovo nije moralna osuda, već **ekonomski signal**. Potrošnja na kulturu i restorane je često znak višeg raspoloživog dohotka i razvijenije uslužne ekonomije. Sa druge strane, kada su prihodi niži, potrošnja se fokusira na **pristupačnije oblike zadovoljstva**. To je odraz ekonomskih mogućnosti, a ne karaktera.

### Zaključak

Podaci nam govore da u Srbiji ne postoji jedna, već najmanje dve ekonomske priče. Jedna je priča o Beogradu, koji uspeva da održi pozitivan bilans, i druga o ostatku Srbije, gde domaćinstva žive "od prvog do prvog", često ulazeći u minus.

Sposobnost da se štedi nije samo odraz finansijske discipline; ona je odraz ekonomske snage, stabilnosti i optimizma. Naši podaci, obrađeni uz pomoć Pythona i njegovih biblioteka, pokazuju da je taj optimizam neravnomerno raspoređen. To je ključni izazov o kojem kao društvo moramo da razmišljamo. Jer na kraju, zdrava ekonomija je ona u kojoj svi delovi celine imaju priliku da napreduju, a ne samo jedan njen deo.

Kompletan kod može se naći [ovde][github-repo] 🔗.

[github-repo]: https://github.com/GolubovicNikola/blog-jupyter-notebooks/blob/main/da-li-srpska-domacinstva-stede.ipynb "Pogledaj kod na GitHub-u"