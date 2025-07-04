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

Vremenske serije su niz (serija) uzoraka neke slučajne promenljive beležene u jednakim vremenskim intervalima.

Vreme #1, posmatrana vrednost (u vremenu t = 1)
Vreme #2, posmatrana vrednost (u vremenu t = 2)
...
Vreme #N, posmatrana vrednost (u vremenu t = N)


Primeri vremenskih serija:
- Cene akcija na berzi
- Temperature po mesecu
- Broj prodatih knjiga
- Profit preduzeća




## Analiza i predikcija vremenskih serija

Analiziramo vremensku seriju kada želimo više da saznamo o samim podacima, kao i o povezanosti podataka i njihovoj strukturi. Koristeći modele za predikciju, nastojimo da predvidimo što tačniju dalju vrednost vremenskih serija.

U deskriptivnom matematičkom modeliranju, ili analizi vremenskih serija, modeliranjem
vremenske serije se određuju njene komponente. Zatim, sa dobijenim informacijama o
komponentama, vršimo predikciju.

Analiza vremenske serije podrazumeva razvijanje modela koji će na najbolji način da je opiše zarad što boljeg razumevanja nastalih rezultata. Analizom težimo da dobijemo odgovor na „zašto“ se nešto desilo i tako utičemo na dalji razvog modela za predikciju.

Ovo često podrazumeva uvođenje statističke pretpostavke (hipoteze) o podacima i kao što smo napomenuli, dekompoziciju vremenske serije na njene komponente.

## Predstavljanje vremenskih serija

Prva stvar koja se radi u analizi vremenske serije - jeste njeno iscrtavanje. Grafikoni omogućuju vizuelizaciju podataka i brz uvid u same karakteristike podataka, uključujući moguće šablone (rast ili pad vrednosti u periodičnim trenucima), neubičajne vrednosti, vezu među promenljivama... Karakteristike podataka su bitne jer u potpunosti utiču na dalji uspeh u predikciji. 

<iframe width="100%" height="476" frameborder="0"
  src="https://observablehq.com/embed/9a3471806731815c@48?cells=singleLine"></iframe>

<iframe width="100%" height="476" frameborder="0"
  src="https://observablehq.com/embed/9a3471806731815c@53?cells=name"></iframe>

  
![Predstavljanje vremenske serije broja novorodencadi 1959. godine i predikcija za mesec dana]({{ site.url }}/assets/images/time-series-prediction.png)

Odabir najboljeg modela za predikciju zavise u mnogome od vrste raspoloživih podataka. Modeli korišćeni za predikciju kroz obradu serije podrazumevaju dekompoziciju modela na komonente - tehnikom pomeranja srednje vredosti ili tehnikom poravnanja.

## Šabloni vremenskih serija

**Trend** - kažemo da postoji trend medu podacima kada vrednost podataka raste ili se smanjuje duži vremenski period. Dat je primer konstantnog rasta potrošnje električne energije u Australiji

**Sezonski šabloni** - podaci se javljaju sezonski, ili periodično, kada je vrednost konstanto niska ili visoka istom periodu. Primer pad temperature u poslednjim kvartalima posmatrana kroz godine, frekvencija posete supermarketu u toku nedelje ili dana. Ovaj šablon se javlja kod podataka koji su pod uticajem spoljašnih faktora. 

<iframe width="100%" height="476" frameborder="0"
  src="https://observablehq.com/embed/9a3471806731815c@122?cells=hourlyTemperature"></iframe>


**Ciklični šabloni** - podaci se javljaju ciklično kada vrednost raste i pada u različitim intervalima.

Glavna razlika između sezonskih i cikličnih podataka je ta što se kod sezonskih podaka, podaci javljaju uvek u istom periodu posmatranog vremena (svakog 10. u mesecu, svake jeseni...). 
Magnituda (pravac vektora koji predstavlja promenu između dva beleženja) cikličnih podataka više varira u odnosu na sezonske. 

<iframe width="100%" height="476" frameborder="0"
  src="https://observablehq.com/embed/9a3471806731815c@180?cells=electricityChart"></iframe>

![Dnevne promene u cent Guglovih akcija]({{ site.url }}/assets/images/daily-stock-changes.png)


Vremenske serije često u sebi sadrže šablone poput trenda, sezonaliteta, i cikličnosti. Kako bi odabrali metod za predikciju vremenskih serija, moramo prvo da identifikujemo koji, i u kojoj meri se javljaju šabloni među podacima.

## Autokorelacija

U statistici korelacija meri linearnu zavisnost između dve promenljive, autokorelacija meri
linearnu zavisnost između posmatrane vrednosti i iste vrednosti u prošlosti. 

  <iframe width="100%" height="424" frameborder="0"
  src="https://observablehq.com/embed/220baa55dd2a0368?cells=viewof+data%2Cviewof+fields%2Ca"></iframe>
$$
\begin{equation}
   r_k={\sum_{n=k+1}^N (x_n - \overline{x})(x_{n-k}-\overline{x}) \over \sum_{n=1}^N {(x_n-\overline{x})}^2}
%    r_k={\sum_{n=k+1}^N (\hat{x}_n - \overline{x})(\hat{x}_{n-k}-\overline{x}) \over \sum_{n=1}^N {(\hat{x}_n-\overline{x})}^2}
  \label{eq:autocorrelation}
\end{equation}
$$

gde je $r_k$ autokorelacija između posmatrane vrednosti $x_n$ $x_k$, i $N$ ukupna dužina vremenske serije.

## Sezonalitet-periodičnost

Kada podaci pokazuju sezonalitet, vrednost autokorelacije će biti velika za periodične vrednosti $x$-ose, tj identično zaostajanje u posmatranju vremenske serije (npr. $r_1$ je poslednja observacija vremenske serije, $r_8$ observacija koja se desila 8 identičnih intervala ranije u vremenskoj seriji –  $r_1, 𝑟_5, 𝑟_9, 𝑟_{13}$... zaostajanje je svuda 4 i ukoliko se javlja identičan uticaj na vrednost vremenske serije u ovim vremenskim intervalima, znači da dolazi do uticaja sezonaliteta). Pri iscrtavanju ACF i PACF grafikona, obeležja vremenskih intervala kod vremenske serije zapisujemo kao *lag*. 

**slika 8**

Kada vremenska serija sadrži trend, podaci su autokorelisani za posmatranja koja su se neposredno desili jedno za drugim, i njihova korelisanost će se polako smanjivati za dalja 
posmatranja (veća vremenska odstupanja). Podaci sa oba šablona će imati kombinaciju ovih efekata.

**slika 9**
