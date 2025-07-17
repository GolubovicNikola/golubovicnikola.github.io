---
layout: post
title: Uvod u vremenske serije
date: 2023-05-15
author: nikola
categories: [Data Science, Time Series]
tags: [forecasting, data visualization]
pin: true
math: true
---

<script src="https://giscus.app/client.js"
        data-repo="golubovicnikola/golubovicnikola.github.io"
        data-repo-id="R_kgDOO1LoLA"
        data-category="Announcements"
        data-category-id="DIC_kwDOO1LoLM4CseOJ"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="hbs"
        crossorigin="anonymous"
        async>
</script>



## Uvod
Vremenska serija je niz uzoraka neke vrednosti beležene u jednakim vremenskim intervalima.

- Vreme #1: posmatrana vrednost (u vremenu t = 1)
- Vreme #2: posmatrana vrednost (u vremenu t = 2)
- ...
- Vreme #N: posmatrana vrednost (u vremenu t = N)

> Posmatranu vrednost često nazivamo i slučajna promenljiva.
{: .prompt-info }

Primeri vremenskih serija:
- Cene akcija na berzi
- Temperature po mesecu
- Broj prodatih knjiga
- Profit preduzeća
 

<figure>
    <iframe width="100%" height="476" frameborder="0"
        src="https://observablehq.com/embed/9a3471806731815c@48?cells=singleLine"></iframe>
    <figcaption style="text-align:center;">
        Prikaz jednostavne vremenske serije sa jednom linijom – osnovna vizualizacija podataka kroz vreme.
    </figcaption>
</figure>


### Analiza i predikcija vremenskih serija

Analizu nad vremenskom serijom vršimo kada želimo da bolje razumemo podatke, tj. uočimo ključne osobine o povezanosti i strukturi podataka.  

To uključuje:
- razumevanje osnovne strukture i organizacije,
- razumevanje pojava i ponašanja koja se javljaju,
- identifikacija efekata koji utiču na njihovu pojavu,
- predviđanje budućeg ponašanja

Analizom težimo da dobijemo odgovor „zašto“ se nešto desilo i tako utičemo na dalji razvog modela za predikciju.

Predikcija podrazumeva predviđanje vrednosti vremenske serije koristeći se informacijama koje smo dobili iz prethodno urađene analize.

Uspešnost predviđanja zavisi isključivo od validnosti informacija dobijenih iz analize.

Analiza vremenske serije podrazumeva razvijanje modela (simulacije) koji će na najbolji način da simulira ponašanje vanmatematičke pojave. Ovo često podrazumeva uvođenje statističke pretpostavke (hipoteze) o podacima i dekompoziciju vremenske serije na njene komponente.


### Predstavljanje vremenskih serija

Prva stvar koja se radi u analizi vremenske serije - jeste njeno iscrtavanje. Grafikoni omogućuju vizuelizaciju podataka i brz uvid u karakteristike podataka, uključujući šablone, neuobičajne vrednosti i povezanost među promenljivama. Karakteristike podataka su bitne jer u potpunosti utiču na dalji uspeh u predikciji. 

<iframe width="100%" height="476" frameborder="0"
  src="https://observablehq.com/embed/9a3471806731815c@53?cells=name"></iframe>


## Šabloni vremenskih serija

Vremenske serije često u sebi sadrže šablone poput trenda, sezonaliteta, i cikličnosti. Kako bi odabrali metod za predikciju vremenskih serija, moramo prvo da identifikujemo koji, i u kojoj meri se javljaju šabloni među podacima.

**Trend** - kažemo da postoji trend medu podacima kada vrednost posmatrane slučajne promenljive raste ili opada  duži vremenski period.

>Dat je primer konstantnog rasta potrošnje električne energije u Australiji

**Sezonski šabloni** - podaci se javljaju sezonski (periodično) kada je vrednost posmatrane slučajne promenljive konstanto niska ili visoka istom periodu. Ovaj šablon se javlja kod podataka koji su pod uticajem spoljašnih faktora. 

>Primer pad temperature u poslednjim kvartalima posmatrana kroz godine, frekvencija posete supermarketu u toku nedelje ili dana. 

<iframe width="100%" height="476" frameborder="0"
  src="https://observablehq.com/embed/9a3471806731815c@122?cells=hourlyTemperature"></iframe>


**Ciklični šabloni** - podaci se javljaju ciklično kada vrednosta raste i pada u različitim intervalima.

Glavna razlika između sezonskih i cikličnih podataka je ta što se kod sezonskih podataka, podaci javljaju uvek u istom periodu posmatranog vremena (svakog 10. u mesecu, svake jeseni...). 
Magnituda (promena između dva beleženja) cikličnih podataka više varira u odnosu na sezonske. 

<iframe width="100%" height="476" frameborder="0"
  src="https://observablehq.com/embed/9a3471806731815c@180?cells=electricityChart"></iframe>

![Dnevne promene u cent Guglovih akcija]({{ site.url }}/assets/images/daily-stock-changes.png)

## Autokorelacija

U statistici, korelacija meri linearnu zavisnost između dve promenljive, dok autokorelacija meri linearnu zavisnost između vrednosti iste promenljive u različitim vremenskim tačkama.
$$
\begin{equation}
   r_k={\sum_{n=k+1}^N (x_n - \overline{x})(x_{n-k}-\overline{x}) \over \sum_{n=1}^N {(x_n-\overline{x})}^2}
%    r_k={\sum_{n=k+1}^N (\hat{x}_n - \overline{x})(\hat{x}_{n-k}-\overline{x}) \over \sum_{n=1}^N {(\hat{x}_n-\overline{x})}^2}
  \label{eq:autocorrelation}
\end{equation}
$$

gde je $r_k$ autokorelacija između posmatrane vrednosti $x_n$ $x_k$, i $N$ ukupna dužina vremenske serije.

<iframe width="100%" height="424" frameborder="0"
  src="https://observablehq.com/embed/220baa55dd2a0368?cells=viewof+data%2Cviewof+fields%2Ca"></iframe>

Autokorelacija je bitna ukoliko se koristi ARIMA model za predikciju vremenske serije, jer analiza autokorelacije pomaže AR i MA parametre za ARIMA model. 

## Sezonalitet-periodičnost

Kada podaci pokazuju sezonalitet, vrednost autokorelacije će biti velika za periodične vrednosti $x$-ose, tj identično zaostajanje u posmatranju vremenske serije (npr. $r_1$ je poslednja observacija vremenske serije, $r_8$ observacija koja se desila 8 identičnih intervala ranije u vremenskoj seriji –  $r_1, 𝑟_5, 𝑟_9, 𝑟_{13}$... zaostajanje je svuda 4 i ukoliko se javlja identičan uticaj na vrednost vremenske serije u ovim vremenskim intervalima, znači da dolazi do uticaja sezonaliteta). Pri iscrtavanju ACF i PACF grafikona, obeležja vremenskih intervala kod vremenske serije zapisujemo kao *lag*. 

**slika 8**

Kada vremenska serija sadrži trend, podaci su autokorelisani za posmatranja koja su se neposredno desili jedno za drugim, i njihova korelisanost će se polako smanjivati za dalja 
posmatranja (veća vremenska odstupanja). Podaci sa oba šablona će imati kombinaciju ovih efekata.

**slika 9**


Odabir najboljeg modela za predikciju zavise u mnogome od vrste raspoloživih podataka. Modeli korišćeni za predikciju kroz obradu serije podrazumevaju dekompoziciju modela na komonente upotrebom dveju tehnika:
1. Tehnika pomeranja srednje vredosti 
2. Tehnika poravnanja.
