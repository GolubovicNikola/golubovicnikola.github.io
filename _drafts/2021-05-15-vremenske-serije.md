---
layout: post
title: Analiza i modeli za predikciju vremenskih serija
date: 2023-05-15
author: Nikola
categories: [Data Science, Time Series]
tags: [ARIMA, forecasting, data visualization]
pin: true
math: true
---

# Analiza i modeli za predikciju vremenskih serija



## 2.1 Uvod u vremenske serije

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




### 2.1.1 Analiza i predikcija vremenskih serija

Analiziramo vremensku seriju kada želimo više da saznamo o samim podacima, kao i o povezanosti podataka i njihovoj strukturi. Koristeći modele za predikciju, nastojimo da predvidimo što tačniju dalju vrednost vremenskih serija.

U deskriptivnom matematičkom modeliranju, ili analizi vremenskih serija, modeliranjem
vremenske serije se određuju njene komponente. Zatim, sa dobijenim informacijama o
komponentama, vršimo predikciju.

Analiza vremenske serije podrazumeva razvijanje modela koji će na najbolji način da je opiše zarad što boljeg razumevanja nastalih rezultata. Analizom težimo da dobijemo odgovor na „zašto“ se nešto desilo i tako utičemo na dalji razvog modela za predikciju.

Ovo često podrazumeva uvođenje statističke pretpostavke (hipoteze) o podacima i kao što smo napomenuli, dekompoziciju vremenske serije na njene komponente.

### Predstavljanje vremenskih serija
Prva stvar koja se radi u analizi vremenske serije - jeste njeno iscrtavanje. Grafikoni omogućuju vizuelizaciju podataka i brz uvid u same karakteristike podataka, uključujući moguće šablone (rast ili pad vrednosti u periodičnim trenucima), neubičajne vrednosti, vezu među promenljivama... Karakteristike podataka su bitne jer u potpunosti utiču na dalji uspeh u predikciji. 

<iframe width="100%" height="476" frameborder="0"
  src="https://observablehq.com/embed/9a3471806731815c@48?cells=singleLine"></iframe>

<iframe width="100%" height="476" frameborder="0"
  src="https://observablehq.com/embed/9a3471806731815c@53?cells=name"></iframe>

  
![Predstavljanje vremenske serije broja novorodencadi 1959. godine i predikcija za mesec dana]({{ site.url }}/assets/images/time-series-prediction.png)

Odabir najboljeg modela za predikciju zavise u mnogome od vrste raspoloživih podataka. Modeli korišćeni za predikciju kroz obradu serije podrazumevaju dekompoziciju modela na komonente - tehnikom pomeranja srednje vredosti ili tehnikom poravnanja.

### 2.1.2 Šabloni vremenskih serija

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

### Autokorelacija

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

### Sezonalitet-periodičnost

Kada podaci pokazuju sezonalitet, vrednost autokorelacije će biti velika za periodične vrednosti $x$-ose, tj identično zaostajanje u posmatranju vremenske serije (npr. $r_1$ je poslednja observacija vremenske serije, $r_8$ observacija koja se desila 8 identičnih intervala ranije u vremenskoj seriji –  $r_1, 𝑟_5, 𝑟_9, 𝑟_{13}$... zaostajanje je svuda 4 i ukoliko se javlja identičan uticaj na vrednost vremenske serije u ovim vremenskim intervalima, znači da dolazi do uticaja sezonaliteta). Pri iscrtavanju ACF i PACF grafikona, obeležja vremenskih intervala kod vremenske serije zapisujemo kao *lag*. 

**slika 8**

Kada vremenska serija sadrži trend, podaci su autokorelisani za posmatranja koja su se neposredno desili jedno za drugim, i njihova korelisanost će se polako smanjivati za dalja 
posmatranja (veća vremenska odstupanja). Podaci sa oba šablona će imati kombinaciju ovih efekata.

**slika 9**


## 2.2 Dekompozicija vremenske serije

Kao što smo videli vremenska serija može da sadrži različite šablone u sebi, i često je od velike pomoći podela iste na njene komponente – gde svaka komponenta opisuje uticaj pojedinačnog šablona. Modeli za dekompoziciju, dele vremensku seriju na ovaj način. 

Dekompozicija vremenske serije je statistički proces u kome se vremenska serija deli na komponente:
- trend-cikličnost, (često se naziva samo trend zbog jednostavnosti)
- periodičnost
- preostalu komponentu – reziduale (koja sadrži slučajnosti)

Postoje dva načina dekompozicije:
1. Dekompozicija zasnovana na promeni vrednosti
2. Dekompozicija zasnovana na predvidljivosti (kada nemamo podatke)

*kako u ovom radu posmatramo podatke, baziraćemo se samo na prvom tipu dekompozicije*

![Dekompozicija vremenske serije]({{ site.url }}/assets/images/time-series-decomposition.png)

Ukoliko posmatramo zbirnu dekompoziciju, kompotente u zbiru daju vremensku seriju, tj. imamo: 

$$
\begin{equation}
  x_t = S_t + T_t + R_t,
  \label{eq:summary-decomposition}
\end{equation}
$$

gde je $x_t$ vrednost podataka, $S_t$ periodična komponenta, $T_t$ trend komponenta i $R_t$ preostala (rezidual), sve u vremenu $t$. Slično, možemo napisati i dekompoziciju proizvoda, gde se komponente množe:

$$
\begin{equation}
    x_t = S_t \times T_t \times R_t.
  \label{eq:multiplication-decomposition}
\end{equation}
$$

**slika 13**

Alternativno, umesto korišćenja dekompozicije proizvoda, možemo transformisati podatke do stabilne varijanse i zatim izvršiti dekompoziciju zbira. Ovo je moguće uvođenjem transformacije *log* funkcijom jer

$$ x_t = S_t \times T_t \times R_t$$ ;
je isto što i
$$ \log{y_t} = \log{S_t} + \log{T_t} + \log{R_t}$$



### 2.2.1 Tehnike poravnanja

Postoje vremenske serije koje su u potpunosti slučajne i nepredvidive. Primer takve vremenske serije je vrednost akcija na berzi određene kompanije. Njihova vrednost se ne može predvideti. Međutim, kod većine vremenskih serija pored uticaja slučajnosti, njihova vrednost se menja i pod uticajem određenih spoljašnih faktora (vremenski faktor, politički, socijalni...). Kod tih vremenskih serija postoje metode koji eleminišu uticaj slučajnosti i pružaju nam informacije o njihovim vrednostima. Ove metode, pri pravilnoj upotrebi, jasnije prikazuju komponente trendacikličnosti i periodičnosti. 

Postoje dve grupe metoda za "poravnanje":
- Metode srednje vrednosti (*Averaging Methods*)
- Metode eksponencijalnog poravnanja (*Exponential Smoothing Methods*)

Korišćenje srednje vrednosti je najjednostavniji način za poravnanje vremenske serije. Prvi put se javlja 20-ih godina prošlog veka i koristi sve do 50-ih. Ovaj metod danas služi kao osnova mnogih metoda za dekompoziciju, i kao takav, njegovo razumevanje je od velike važnosti.

Prvo ćemo pokazati na primeru „jednostavnu“ srednju vrednost. 

**Primer**

 
Vlasnik kompanije za preradu voća želi da sazna koliko tona voća dobija od tipičnog dobavljača. Uzima slučajno odabanih 12 dobavljača i podataka o nabavci. Data je sledeća tabela: 

| Dobavljač | Količina (tona) |
|:-----------:|:-----------------:|
| 1         | 9              |
| 2         | 8              |
| 3         | 9              |
| 4         | 12              |
| 5         | 9              |
| 6         | 12              |
| 7         | 11              |
| 8         | 7              |
| 9         | 13              |
| 10        | 9              |
| 11        | 11              |
| 12        | 10              |


Srednja vrednost podataka = 10. Vlasnik kompanije je odlučio da srednju vrednost koristi za estimaciju proizvodnje tipičnog dobavljača. Da li je ovo dobra ili loša estimacija? Računamo prosečnu kvadratnu grešku (MSE):
- **Greška** – razlika između prave i predviđene vrednosti
- **Kvadratna greška** – pomenuta greška na kvadrat
- **Ukupna kvadratna greška (SSE)** – zbir kvadratnih grešaka (Sum of the squared errors)
- **Prosečna kvadratna greška (MSE)** – srednja vrednost kvadratnih grešaka (Mean of the squared errors)

| Dobavljač | Količina (tona) | Greška | Kvadratna greška |
|:---------:|:---------------:|:-------------------:|:----------------:|
|    1      |        9        |         -1          |        1         |
|    2      |        8        |         -2          |        4         |
|    3      |        9        |         -1          |        1         |
|    4      |       12        |         2          |        4         |
|    5      |        9        |         -1          |        1         |
|    6      |       12        |         2          |        4         |
|    7      |       11        |         1          |        1         |
|    8      |        7        |         -3          |        9         |
|    9      |       13        |         3          |        9         |
|   10      |        9        |         -1          |        1         |
|   11      |       11        |         1          |        1         |
|   12      |       10        |         0          |        0         |

 
$SSE = 36$ i $$MSE = 36/12 = 3$$ 
 
Koliko je ovaj estimator dobar? Uporedićemo estomator srednje vrednosti (10) sa predviđanjima da će dobavljač dostaviti 7 ili 9 ili 12 tona voća. 
 
Računajući već pomenute pojmove, za definisane podatke, dobijamo: 

|             | Predviđanje 7 | Predviđanje 9 | Predviđanje 10 | Predviđanje 12 |
|:-----------:|:-------------:|:-------------:|:--------------:|:--------------:|
| **SSE**     |     144       |      48       |      36        |      84        |
| **MSE**     |      12       |       4       |       3        |       7        |

Estimator sa najmanjim MSE je najbolji. Može se matematički pokazati da najbolji estimator, tj onaj koji minimizuje metod prosečne kvadratne greške – srednja vrednost.

Sada ćemo iskoristiti pojam srednje vrednosti u vremenskoj seriji kako bi predvideli neto zaradu. Tabela sadrži podatke o neto zaradi kompanije po godinama, počev od 2011. do 2020. 

| Godina | Neto zarada (milioni) | Srednja vrednost | Greška  | Kvadratna greška |
|:------:|:---------------------:|:----------------:|:-------:|:----------------:|
| 2011   | 46.163                | 48.676           | -2.513  | 6.313            |
| 2012   | 46.998                | 48.676           | -1.678  | 2.814            |
| 2013   | 47.816                | 48.676           | -0.860  | 0.739            |
| 2014   | 48.311                | 48.676           | -0.365  | 0.133            |
| 2015   | 48.758                | 48.676           | 0.082   | 0.007            |
| 2016   | 49.164                | 48.676           | 0.488   | 0.239            |
| 2017   | 49.548                | 48.676           | 0.872   | 0.761            |
| 2018   | 48.915                | 48.676           | 0.239   | 0.057            |
| 2019   | 50.315                | 48.676           | 1.639   | 2.688            |
| 2020   | 50.768                | 48.676           | 2.092   | 4.378            |

$$MSE = 1.8129$$

Pitanje koje se postavlja: da li možemo korišćenjem srednje vrednosti da predvidimo zaradu ukoliko uvidimo da se javlja trend među podacima?

$$slika 14$$

Dakle:
1. Prosečna vrednost uzoraka je koristan estimator za predviđanje samo ukoliko ne postoji trend među podacima. Ukoliko se on javlja, koriste se drugi metodi koji vode računa o uticaju trenda na podatke. 2. Svaki uzorak u prošlosti se posmatra kao jednak – imaju iste „težine“. Prostije rečeno, uticaj 2011. i 2020. godine je isti, dok je verovatnije da će uzorci koji su se desili neposredno jedan za drugim imati sličnu vrednost. Na primer, prosek vrednosti 3,4 i 5 je 4. Znamo tako što smo sabrali ova tri broja i podelili sa njihovim brojem. Drugi način za računanje prosečne vrednosti je sabiranje svake vrednosti deljeno sa ukupnim brojem 
vrednosti, tj:

$\frac{3}{3} + \frac{4}{3} + \frac{5}{3} = 4$

Množioc $\frac{1}{3}$ se naziva *težina*.

$$\overline{x} = \frac{1}{n} \sum_{i=0}^n x_i = \left(\frac{1}{n}\right)x_1 + \left(\frac{1}{n}\right)x_2 + \left(\frac{1}{n}\right)x_3 + \ldots + \left(\frac{1}{n}\right)x_n$$

Vrednost $\left(\frac{1}{n}\right)$ predstavlja težine, i njihov zbir je 1.

### 2.2.2 Pomeranje srednje vrednosti

Posmatrajmo podatke iz tabele o prozvodnji voća. Posmatrajmo podskup ***M*** čiju veličinu definišemo na 3. Onda bi prosečna vrednost prva tri uzorka bila: (9 + 8 + 9)/3 = 8.667 

Ovaj tehnika se naziva poravnanjem (oblik srednje vrednosti). Ovaj proces poravnanja se nastavlja dalje i računa sledeća srednja vrednost tri broja, tako što smo odbacili prvi broj, a uzeli naredni u razmatranje.


Tehnika pomeranja srednje vrednosti (Moving Average) se izračunava kao:

$$
\begin{equation}
  MA_t = {(X_t + X_{t-1} + ... + X_{t-N+1}) \over N}
%   \sum_{n=1}^\infty 1/n^2 = \frac{\pi^2}{6}
  \label{eq:moving-average}
\end{equation}
$$
<!-- $$ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $$ -->
 <!-- $a \ne 0$ -->

U jednačini \eqref{eq:moving-average} je:
- $MA_t$ - srednja vrednost u vremenu $t$
- $X_t$ - uzorak u vremenu $t$
- $N$ - broj uzoraka u prozoru

uslov da je $ t < N$

Primer:

| Dobavljač | Tona | MA     | Greška  | Kvadratna greška |
|:---------:|:----:|:------:|:-------:|:----------------:|
|     1     |  9   |        |         |                  |
|     2     |  8   |        |         |                  |
|     3     |  9   | 8.667  | 0.333   | 0.111            |
|     4     | 12   | 9.667  | 2.333   | 5.444            |
|     5     |  9   | 10.000 | -1.000  | 1.000            |
|     6     | 12   | 11.000 | 1.000   | 1.000            |
|     7     | 11   | 10.667 | 0.333   | 0.111            |
|     8     |  7   | 10.000 | -3.000  | 9.000            |
|     9     | 13   | 10.333 | 2.667   | 7.111            |
|    10     |  9   | 9.667  | -0.667  | 0.444            |
|    11     | 11   | 11.000 | 0       | 0                |
|    12     | 10   | 10.000 | 0       | 0                |

Srednja kvadratna greška $MSE$ za $MA_3$ iznosi 2.42 u poređenju sa prvobitnom vrednošću 3. 

### 2.2.3 Eksponencijalno poravnanje

Eksponencijalno poravnanje predstavlja vrlo značajnu tehniku poravnavanja vremenskih serija. Postoje tri glavne vrste:

1. Jednostavno eksponencijalno poravnanje (Holt, 1957)
2. Duplo eksponencijalno poravnanje (Holt, 1958)
3. Trostruko eksponencijalno poravnanje (Holt-Vinters metoda, Vinters 1965)

#### Jednostvno eksponencijalno poravnanje 

Uvodimo vrednost $S_2$ = $x_1$, gde sa $S_1$ označavamo uzorke poravnanja, a sa $x_i$ originalni uzorak u vremenu $i$, $i < n $. Za $S_3 = \alpha x_2 + (1−\alpha)𝑆_3$; i tako dalje. Kako sa ekponencijalnim poravnanjem krećemo sa drugim uzorkom, ne postoji vrednost za $𝑆_1$. 

Osnovna formula za jednostavno eksponencijalno poravnanje:

$$
\begin{equation}
S_t = \alpha X_{t-1} + (1-\alpha)S_{t-1}, \quad 0 < \alpha \leq 1, \ t \geq 3
%   \sum_{n=1}^\infty 1/n^2 = \frac{\pi^2}{6}
  \label{eq:exponential-soothing}
\end{equation}
$$

gde je:
- $S_t$ - vrednost poravnanja u vremenu t
- $α$ - konstanta poravnanja
- $X_{t-1}$ - stvarna vrednost u prethodnom periodu

**Odabir prvog uzorka**: Inicijalizacija prvog uzorka poravnanja 𝑆2 je od velikog značaja za dalju inicijalizaciju vrednosti $S_t$.  

Ukoliko definišemo vrednost $𝑆_2$ kao $𝑥_1$ to je jedan način inicijalizacije. Drugi način je da odabir 
ciljane vrednosti u vremenskoj seriji, tj $𝑥_𝑖$. Još jedan od načina bi bio prosek prvih četiri ili pet 
uzoraka. 

Može se dokazati da što je manja vrednost parametra $\alpha$, to je značaj odabira inicijalne vrednosti poravnanja veći. Preporuka je da se isprobaju par metoda za inicijalizaciju (pomoću softverskog alata) i tako dobije uvid o uspešnosti pre konačnog podešavanja modela. 

#### Zašto se zove *Eksponencijalno* ?

Da bismo dali odgovor na ovo pitanje, proširićemo osnovnu jednačinu zamenom $S_{t-1}$

$$
S_t = \alpha x_{t-1} + (1-\alpha)[\alpha x_{t-2} + (1-\alpha)S_{t-2}] \\
= \alpha x_{t-1} + \alpha(1-\alpha)x_{t-2} + (1-\alpha)^2 S_{t-2}
$$

Daljom zamenom $S_{t-2}$, zatim $S_{t-3}$ i tako dalje, sve dok ne dođemo do $S_2$ (koje je $x_1$), dobijamo sledeću formu jednačine:

$$
S_t = \alpha \sum_{i=1}^{t-2} (1-\alpha)^{i-1} x_{t-i} + (1-\alpha)^{t-2} S_2, \quad t \geq 2
$$

Primer proširene jednačine eksponencijalnog poravnanja za $S_5$:

$$
S_5 = \alpha \left[ (1-\alpha)^0 x_{4} + (1-\alpha)^1 x_{3} + (1-\alpha)^2 x_{2} \right] + (1-\alpha)^3 S_2
$$

Ovo predstavlja eksponencijalnu osobinu: težine $\alpha (1-\alpha)^t$ eksponencijalno opadaju kako $t$ raste. Iz ove osobine možemo zaključiti da uticaj prethodnih vrednosti na $S_t$ opada sa svakim narednim vremenom $t$.

Kada je $\alpha$ blizu 1, poravnanje (odbacivanje prethodnih uzoraka) dolazi brzo, dok kada je $\alpha$, poravnanje je sporo. Ovo je prikazano sledećom tabelo

| $\alpha$ | $(1-\alpha)$ | $(1-\alpha)^2$ | $(1-\alpha)^3$ | $(1-\alpha)^4$ |
|:--------:|:------------:|:--------------:|:--------------:|:--------------:|
|   0.9    |     0.1      |     0.01       |     0.001      |    0.0001      |
|   0.5    |     0.5      |     0.25       |     0.125      |    0.0625      |
|   0.1    |     0.9      |     0.81       |     0.729      |    0.6561      |

Najbolju vrednost za $\alpha$ biramo tako vrednost rezultira najmanjom prosečnom greškom kvadrata 
$(MSE)$. 

Primer sa podacima koje sadrže 12 posmatranih uzoraka vremenske serije: 

| VREME t | xₜ | Sₜ (α=0.1) | GREŠKA | KVADRATNA GREŠKA |
|:-------:|:--:|:----------:|:------:|:----------------:|
|    1    | 71 |            |        |                  |
|    2    | 70 |   71.00    | -1.00  |      1.00        |
|    3    | 69 |   70.90    | -1.90  |      3.61        |
|    4    | 68 |   70.71    | -2.71  |      7.34        |
|    5    | 64 |   70.44    | -6.44  |     41.47        |
|    6    | 65 |   69.80    | -4.80  |     23.04        |
|    7    | 72 |   69.32    |  2.68  |      7.18        |
|    8    | 78 |   69.58    |  8.42  |     70.90        |
|    9    | 75 |   70.43    |  4.57  |     20.88        |
|   10    | 75 |   70.88    |  4.12  |     16.97        |
|   11    | 75 |   71.29    |  3.71  |     13.76        |
|   12    | 70 |   71.67    | -1.67  |      2.79        |
Suma kvadratnih grešaka (SSE) iznosi $208.94$. Prosečna kvadratna greška (MSE) je
$$
MSE = \frac{208.94}{11} = 19.0
$$
Možemo li bolje? Ponavljanjem istog procesa za $\alpha = 0.5$, dobijamo $MSE = 16.29$. Ovo je iterativni proces sve dok ne pronađemo najbolju vrednost za $\alpha$.

Većina softverskih alata ima implementiranu podršku za pronalaženje odgovarajućeg parametra $\alpha$ optimizacijom Marquardt algoritma.

**Marquardt algoritam** je zauzeo bitno mesto u matematici i računarstvu zbog svoje primene kod problema najmanjih kvadrata nelinearne funkcije. Najčešće se koristi kod minimizacije metoda najmanjih kvadrata kako bi dobili nelinearni model koji bliže određuje podatke.

Neka su dati $n$ empirijskih parova $(x_i, y_i)$ — vrednosti dobijene na osnovu iskustava ili činjenica. Cilj algoritma je pronaći parametre $\alpha$ modela $f(x, \alpha)$ tako da je razlika (odstupanje) između modela i stvarnih vrednosti minimalna. 
$$
\hat{\omega} = \underset{\alpha}{\arg\min} \sum_{i=1}^n \left[ y_i - f(x_i, \alpha) \right]^2
$$

Jednačina eksponencijalnog poravnanja generalno se može zapisati kao:

$$
S_{t+1} = \alpha x_t + (1 - \alpha) S_t, \quad 0 < \alpha \leq 1, \ t > 0
$$

Dalje, možemo je zapisati i kao:

$$
S_{t+1} = S_t + \alpha \varepsilon_t,
$$

gde je $\varepsilon_t$ greška predviđanja za vremenski period $t$.

Drugim rečima, novo predviđanje je staro predviđanje plus prilagođavanje (množenje konstantom $\alpha$) greške koja se javila u poslednjem predviđanju.

Jednostavno eksponencijalno poravnanje ne može uspešno da izvrši predikciju kod podataka kod kojih se javlja trend. Da bi prevazišao ovaj problem, Holt je 1957. godine proširio jednostavno eksponencijalno poravnanje dodavši još jednu jednačinu koja bliže opisuje uticaj trenda na podatke.

**Poravnanje sa dve jednačine – linearni trend metod (Holtov metod):**

$$
\begin{aligned}
S_t &= \alpha x_t + (1-\alpha)(S_{t-1} + b_{t-1}), \quad 0 \leq \alpha \leq 1 \\
b_t &= \beta (S_t - S_{t-1}) + (1-\beta) b_{t-1}, \quad 0 \leq \beta \leq 1
\end{aligned}
$$

Ovde je $b_{t-1}$ procena (nagib) trenda, dok je $\beta$ parametar poravnanja za trend. Konstanta $\beta$ se određuje u zavisnosti od $\alpha$.

Prva jednačina poravnanja prilagođava $S_t$ pod uticajem trenda prethodnog perioda $b_{t-1}$, dodajući ga na prethodnu poravnatu vrednost $S_{t-1}$. Druga jednačina dodeljuje novu vrednost trendu, izraženu kao razlika poslednje dve vrednosti (pod uticajem konstante $\beta$). Vidimo da je ova jednačina slična jednostavnom poravnanju, s tim da ovde vodimo računa o informacijama za trend podataka.

Optimalne vrednosti parametara $\alpha$ i $\beta$ mogu se odrediti optimizacijom Marquardt algoritma.

**Početne vrednosti $S_1$ i $b_1$**

Kao i kod jednostavnog poravnanja, postoji nekoliko načina za odabir inicijalnih vrednosti za $S_t$ i $b_t$ kod eksponencijalnog poravnanja sa dve jednačine:

- $S_1 = x_1$
- Za $b_1$ postoje tri mogućnosti:
    - $b_1 = y_2 - y_1$
    - $b_1 = \frac{1}{3} \left[(y_2 - y_1) + (y_3 - y_2) + (y_4 - y_3)\right]$
    - $b_1 = \frac{y_n - y_1}{n-1}$

**Predikcija koristeći poravnanje sa dve jednačine – linearni trend metod**

Predviđanje jedan korak unapred dato je formulom:
$$
\hat{y}_{t+1} = S_t + b_t
$$

Predviđanje $m$ koraka unapred dato je formulom:
$$
\hat{y}_{t+m} = S_t + m b_t
$$

Ovakvo predviđanje $m$ koraka unapred moguće je jer formula predviđanja više nije ravna, već imamo linearnu funkciju od $m$.

**Poravnanje sa dve jednačine – opadajući trend metod**

Predikcije generisane linearnom metodom prikazuju konstantan trend (rastući ili opadajući) beskonačno u budućnost. Da bi se ova karakteristika "ublažila", uvodi se parametar opadanja $\phi$, $0 < \phi < 1$, koji liniju predikcije u nekom trenutku dovodi do ravne linije.

Uz iste parametre kao kod linearnog metoda, uvodimo parametar opadanja:

$$
\begin{aligned}
S_t &= \alpha x_t + (1-\alpha)(S_{t-1} + \phi b_{t-1}) \\
b_t &= \gamma (S_t - S_{t-1}) + (1-\beta)\phi b_{t-1}
\end{aligned}
$$

Ukoliko je $\phi = 1$, opadajući trend metod je identičan linearnom trend metodu. Za vrednosti između 0 i 1, $\phi$ "ravna" funkciju tako da trend postaje konstantan u nekom trenutku. U praksi, $\phi$ je retko manji od 0.8, a obično se ograničava na $0.8 < \phi < 0.98$.

**Predikcija koristeći opadajući trend metod:**

Predviđanje jedan korak unapred:
$$
F_{t+1} = S_t + \phi b_t
$$

Predviđanje $m$ koraka unapred:
$$
F_{t+m} = S_t + (\phi + \phi^2 + \cdots + \phi^m) b_t
$$


Šta se dešava ukoliko vremenska serija pokazuje osobine trenda i sezonaliteta (periodičnosti)?

### Eksponencijalno poravnanje sa tri jednačine (Holt-Winters metoda)

Model koji uspešno radi sa podacima koji pokazuju i sezonalitet, pored prethodno navedenih jednačina, uvodi još jednu za sezonalitet. Rezultujući skup jednačina naziva se **Holt-Winters metoda**.

Jednačine su:

- **Jednačina poravnanja:**
    $$
    S_t = \alpha \frac{x_t}{I_{t-L}} + (1-\alpha)(S_{t-1} + b_{t-1})
    $$
- **Jednačina trenda:**
    $$
    b_t = \beta (S_t - S_{t-1}) + (1-\beta) b_{t-1}
    $$
- **Jednačina sezonaliteta:**
    $$
    I_t = \gamma \frac{x_t}{S_t} + (1-\gamma) I_{t-L}
    $$
- **Predikcija $m$ koraka unapred:**
    $$
    F_{t+m} = (S_t + m b_t) I_{t-L+m}
    $$

Gde su:
- $x_t$ — uzorak vremenske serije u trenutku $t$
- $S_t$ — komponenta poravnanja (level)
- $b_t$ — komponenta trenda
- $I_t$ — indeks sezonaliteta
- $F_{t+m}$ — predviđanje $m$ koraka unapred
- $L$ — period sezonaliteta (npr. 12 za mesečne podatke sa godišnjom sezonalnošću)
- $\alpha$, $\beta$, $\gamma$ — konstante poravnanja, trenda i sezonaliteta (0 < $\alpha$, $\beta$, $\gamma$ < 1)

Vrednosti konstanti $\alpha$, $\beta$ i $\gamma$ biraju se tako da greška (MSE) bude najmanja moguća — najčešće se softver koristi za njihovu optimizaciju.

Za inicijalizaciju Holt-Winters metode, potrebno je da u podacima postoji najmanje jedno potpuno javljanje sezonaliteta (bez praznih vremenskih intervala), kako bi se odredila početna vrednost $I_{t-L}$.


Sezonalitet se javlja među podacima u $L$ intervalu, gde je $L$ dužina perioda. Uticaj (faktor) trenda određujemo posmatrajući dva vremenska perioda, jedan za drugim. Da bismo zadovoljili pojavljivanje trenda i sezonaliteta, koristimo dva potpuna skupa vremenskih perioda gde se javlja sezonalitet – što daje ukupno $2L$ perioda vremena.

**Početne vrednosti – $b$ i $I$:**  
Formula za estimaciju početnog uticaja trenda:

$$
b = \frac{1}{L} \left( \frac{y_{L+1} - y_1}{L} + \frac{y_{L+2} - y_2}{L} + \cdots + \frac{y_{L+L} - y_L}{L} \right)
$$

**Početne vrednosti sezonskog uticaja:**

Pokazaćemo na primeru. Imamo podatke za prethodnih 6 godina, sa 4 vremenska perioda po godini (to su 4 kvartala).

**Korak 1:** Računamo prosek svakog vremenskog perioda (kvartala) u prethodnih 6 godina:

$$
A_p = \frac{\sum_{i=1}^4 x_i}{4}, \quad p = 1,2,\ldots,6
$$

**Korak 2:** Podeliti uzorke sa prosekom za tu godinu.

| Kvartal | Godina 1         | Godina 2         | Godina 3         | Godina 4         | Godina 5         | Godina 6         |
|:-------:|:----------------:|:----------------:|:----------------:|:----------------:|:----------------:|:----------------:|
|   1     | $x_1/A_1$        | $x_5/A_2$        | $x_9/A_3$        | $x_{13}/A_4$     | $x_{17}/A_5$     | $x_{21}/A_6$     |
|   2     | $x_2/A_1$        | $x_6/A_2$        | $x_{10}/A_3$     | $x_{14}/A_4$     | $x_{18}/A_5$     | $x_{22}/A_6$     |
|   3     | $x_3/A_1$        | $x_7/A_2$        | $x_{11}/A_3$     | $x_{15}/A_4$     | $x_{19}/A_5$     | $x_{23}/A_6$     |
|   4     | $x_4/A_1$        | $x_8/A_2$        | $x_{12}/A_3$     | $x_{16}/A_4$     | $x_{20}/A_5$     | $x_{24}/A_6$     |

**Korak 3:** Sezonske uticaje dobijamo tako što izračunamo prosek svakog reda (ista sezona, kvartal – različite godine):

$$
I_1 = \frac{x_1/A_1 + x_5/A_2 + x_9/A_3 + x_{13}/A_4 + x_{17}/A_5 + x_{21}/A_6}{6}
$$

$$
I_2 = \frac{x_2/A_1 + x_6/A_2 + x_{10}/A_3 + x_{14}/A_4 + x_{18}/A_5 + x_{22}/A_6}{6}
$$

$$
I_3 = \frac{x_3/A_1 + x_7/A_2 + x_{11}/A_3 + x_{15}/A_4 + x_{19}/A_5 + x_{23}/A_6}{6}
$$

$$
I_4 = \frac{x_4/A_1 + x_8/A_2 + x_{12}/A_3 + x_{16}/A_4 + x_{20}/A_5 + x_{24}/A_6}{6}
$$

Može se desiti da softverom za računanje eksponencijalnog poravnanja sa tri jednačine dobijemo da su parametri trenda ($\beta$) i sezonaliteta ($\gamma$) jednaki nuli, ili jedan od njih. To ne znači da njihov uticaj u predikciji ne postoji, već da su početne vrednosti $b$ (trenda) i/ili $I$ (sezonaliteta) tačno onoliko koliko treba, pa njihova izmena ne doprinosi smanjenju greške (MSE).


**slika 16**


## 2.3 ARIMA modeli

ARIMA (AutoRegressive Integrated Moving Average) modeli predstavljaju način za predikciju vremenskih serija.

### 2.3.1 Model autoregresije (AR) i pomeranja srednje vrednosti (MA)

**Autoregresivni model (AR)** predstavlja linearnu kombinaciju prethodnih vrednosti:
X_t = δ + ω_1X_{t-1} + ω_2X_{t-2} + ... + ω_pX_{t-p} + ε_t


**Model pomeranja srednje vrednosti (MA)** koristi prethodne greške u predikciji:
X_t = μ + ε_t + θ_1ε_{t-1} + θ_2ε_{t-2} + ... + θ_qε_{t-q}


### Kombinacija modela

ARIMA model kombinuje autoregresiju, integraciju (diferenciranje) i model pomeranja srednje vrednosti:
X't = δ + ω_1X'{t-1} + ... + ω_pX'{t-p} + ε_t + θ_1ε{t-1} + ... + θ_qε_{t-q}


ARIMA model ima tri parametra (p, d, q):
- p = parametar autoregresije
- d = stepen diferenciranja
- q = parametar pomeranja srednje vrednosti

## 2.4 Koraci u izgradnji ARIMA modela

1. **Upoznavanje sa podacima**
   - Provera stacionarnosti
   - Identifikacija sezonaliteta
   - Transformacija podataka ako je potrebno

2. **Estimacija modela**
   - Određivanje parametara p, d, q
   - Korišćenje ACF i PACF grafika

3. **Utvrđivanje tačnosti modela**
   - Analiza reziduala
   - Ljung-Box test

![Funkcija autokorelacije za podatke pre i posle diferenciranja]({{ site.url }}/assets/images/acf-before-after.png)

### Ljung-Box test

Testiramo hipoteze:
- H0: Model je dobar. Nije potrebno modifikovati
- Ha: Model nije dobar. Potrebno je modifikovati

Test statistika:
Q = n(n+2)Σ(r_k^2/(n-k)) za k=1 do m


Odbacujemo H0 ako Q > χ²_{1-α,h}