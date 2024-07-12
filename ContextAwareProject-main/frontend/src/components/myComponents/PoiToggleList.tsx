import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Feature } from 'ol';
import { fromLonLat } from "ol/proj"
import { Point } from "ol/geom"
import { useEffect, useState } from "react"
// import { Cluster } from "ol/source"
import { Fill, Icon, RegularShape, Style } from "ol/style"
import VectorSource from "ol/source/Vector"
import VectorLayer from "ol/layer/Vector"


import { LayerInfo, PoiData } from "@/common/interfaces";


const icons = new Map();

icons.set("Scuole", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXNjaG9vbCI+PHBhdGggZD0iTTE0IDIydi00YTIgMiAwIDEgMC00IDB2NCIvPjxwYXRoIGQ9Im0xOCAxMCA0IDJ2OGEyIDIgMCAwIDEtMiAySDRhMiAyIDAgMCAxLTItMnYtOGw0LTIiLz48cGF0aCBkPSJNMTggNXYxNyIvPjxwYXRoIGQ9Im00IDYgOC00IDggNCIvPjxwYXRoIGQ9Ik02IDV2MTciLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjkiIHI9IjIiLz48L3N2Zz4=")
icons.set("Dopo Scuola", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVuaXZlcnNpdHkiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTAiIHI9IjEiLz48cGF0aCBkPSJNMjIgMjBWOGgtNGwtNi00LTYgNEgydjEyYTIgMiAwIDAgMCAyIDJoMTZhMiAyIDAgMCAwIDItMiIvPjxwYXRoIGQ9Ik02IDE3di4wMSIvPjxwYXRoIGQ9Ik02IDEzdi4wMSIvPjxwYXRoIGQ9Ik0xOCAxN3YuMDEiLz48cGF0aCBkPSJNMTggMTN2LjAxIi8+PHBhdGggZD0iTTE0IDIydi01YTIgMiAwIDAgMC0yLTJhMiAyIDAgMCAwLTIgMnY1Ii8+PC9zdmc+");
icons.set("Parchi", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXRyZWVzIj48cGF0aCBkPSJNMTAgMTB2LjJBMyAzIDAgMCAxIDguOSAxNkg1YTMgMyAwIDAgMS0xLTUuOFYxMGEzIDMgMCAwIDEgNiAwWiIvPjxwYXRoIGQ9Ik03IDE2djYiLz48cGF0aCBkPSJNMTMgMTl2MyIvPjxwYXRoIGQ9Ik0xMiAxOWg4LjNhMSAxIDAgMCAwIC43LTEuN0wxOCAxNGguM2ExIDEgMCAwIDAgLjctMS43TDE2IDloLjJhMSAxIDAgMCAwIC44LTEuN0wxMyAzbC0xLjQgMS41Ii8+PC9zdmc+")
icons.set("Giochi Bimbi", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXNob3ZlbCI+PHBhdGggZD0iTTIgMjJ2LTVsNS01IDUgNS01IDV6Ii8+PHBhdGggZD0iTTkuNSAxNC41IDE2IDgiLz48cGF0aCBkPSJtMTcgMiA1IDUtLjUuNWEzLjUzIDMuNTMgMCAwIDEtNSAwczAgMCAwIDBhMy41MyAzLjUzIDAgMCAxIDAtNUwxNyAyIi8+PC9zdmc+")
icons.set("Impianti Sportivi", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWxhbmQtcGxvdCI+PHBhdGggZD0ibTEyIDggNi0zLTYtM3YxMCIvPjxwYXRoIGQ9Im04IDExLjk5LTUuNSAzLjE0YTEgMSAwIDAgMCAwIDEuNzRsOC41IDQuODZhMiAyIDAgMCAwIDIgMGw4LjUtNC44NmExIDEgMCAwIDAgMC0xLjc0TDE2IDEyIi8+PHBhdGggZD0ibTYuNDkgMTIuODUgMTEuMDIgNi4zIi8+PHBhdGggZD0iTTE3LjUxIDEyLjg1IDYuNSAxOS4xNSIvPjwvc3ZnPg==")
icons.set("Fermate Bus", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWJ1cy1mcm9udCI+PHBhdGggZD0iTTQgNiAyIDciLz48cGF0aCBkPSJNMTAgNmg0Ii8+PHBhdGggZD0ibTIyIDctMi0xIi8+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiB4PSI0IiB5PSIzIiByeD0iMiIvPjxwYXRoIGQ9Ik00IDExaDE2Ii8+PHBhdGggZD0iTTggMTVoLjAxIi8+PHBhdGggZD0iTTE2IDE1aC4wMSIvPjxwYXRoIGQ9Ik02IDE5djIiLz48cGF0aCBkPSJNMTggMjF2LTIiLz48L3N2Zz4=");
icons.set("Stazioni Treno", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXRyYWluLWZyb250Ij48cGF0aCBkPSJNOCAzLjFWN2E0IDQgMCAwIDAgOCAwVjMuMSIvPjxwYXRoIGQ9Im05IDE1LTEtMSIvPjxwYXRoIGQ9Im0xNSAxNSAxLTEiLz48cGF0aCBkPSJNOSAxOWMtMi44IDAtNS0yLjItNS01di00YTggOCAwIDAgMSAxNiAwdjRjMCAyLjgtMi4yIDUtNSA1WiIvPjxwYXRoIGQ9Im04IDE5LTIgMyIvPjxwYXRoIGQ9Im0xNiAxOSAyIDMiLz48L3N2Zz4=")
icons.set("Parcheggi", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXNxdWFyZS1wYXJraW5nIj48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIi8+PHBhdGggZD0iTTkgMTdWN2g0YTMgMyAwIDAgMSAwIDZIOSIvPjwvc3ZnPg==")
icons.set("Colonnine", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNhYmxlIj48cGF0aCBkPSJNMTcgMjF2LTJhMSAxIDAgMCAxLTEtMXYtMWEyIDIgMCAwIDEgMi0yaDJhMiAyIDAgMCAxIDIgMnYxYTEgMSAwIDAgMS0xIDEiLz48cGF0aCBkPSJNMTkgMTVWNi41YTEgMSAwIDAgMC03IDB2MTFhMSAxIDAgMCAxLTcgMFY5Ii8+PHBhdGggZD0iTTIxIDIxdi0yaC00Ii8+PHBhdGggZD0iTTMgNWg0VjMiLz48cGF0aCBkPSJNNyA1YTEgMSAwIDAgMSAxIDF2MWEyIDIgMCAwIDEtMiAySDRhMiAyIDAgMCAxLTItMlY2YTEgMSAwIDAgMSAxLTFWMyIvPjwvc3ZnPg==");
icons.set("Farmacie", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXBpbGwiPjxwYXRoIGQ9Im0xMC41IDIwLjUgMTAtMTBhNC45NSA0Ljk1IDAgMSAwLTctN2wtMTAgMTBhNC45NSA0Ljk1IDAgMSAwIDcgN1oiLz48cGF0aCBkPSJtOC41IDguNSA3IDciLz48L3N2Zz4=")
icons.set("Ospedali", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNyb3NzIj48cGF0aCBkPSJNMTEgMmEyIDIgMCAwIDAtMiAydjVINGEyIDIgMCAwIDAtMiAydjJjMCAxLjEuOSAyIDIgMmg1djVjMCAxLjEuOSAyIDIgMmgyYTIgMiAwIDAgMCAyLTJ2LTVoNWEyIDIgMCAwIDAgMi0ydi0yYTIgMiAwIDAgMC0yLTJoLTVWNGEyIDIgMCAwIDAtMi0yaC0yeiIvPjwvc3ZnPg==")
icons.set("Supermercati", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXNob3BwaW5nLWJhc2tldCI+PHBhdGggZD0ibTE1IDExLTEgOSIvPjxwYXRoIGQ9Im0xOSAxMS00LTciLz48cGF0aCBkPSJNMiAxMWgyMCIvPjxwYXRoIGQ9Im0zLjUgMTEgMS42IDcuNGEyIDIgMCAwIDAgMiAxLjZoOS44YTIgMiAwIDAgMCAyLTEuNmwxLjctNy40Ii8+PHBhdGggZD0iTTQuNSAxNS41aDE1Ii8+PHBhdGggZD0ibTUgMTEgNC03Ii8+PHBhdGggZD0ibTkgMTEgMSA5Ii8+PC9zdmc+");
icons.set("Banche", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWJhZGdlLWV1cm8iPjxwYXRoIGQ9Ik0zLjg1IDguNjJhNCA0IDAgMCAxIDQuNzgtNC43NyA0IDQgMCAwIDEgNi43NCAwIDQgNCAwIDAgMSA0Ljc4IDQuNzggNCA0IDAgMCAxIDAgNi43NCA0IDQgMCAwIDEtNC43NyA0Ljc4IDQgNCAwIDAgMS02Ljc1IDAgNCA0IDAgMCAxLTQuNzgtNC43NyA0IDQgMCAwIDEgMC02Ljc2WiIvPjxwYXRoIGQ9Ik03IDEyaDUiLz48cGF0aCBkPSJNMTUgOS40YTQgNCAwIDEgMCAwIDUuMiIvPjwvc3ZnPg==");
icons.set("Palestre", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWR1bWJiZWxsIj48cGF0aCBkPSJNMTQuNCAxNC40IDkuNiA5LjYiLz48cGF0aCBkPSJNMTguNjU3IDIxLjQ4NWEyIDIgMCAxIDEtMi44MjktMi44MjhsLTEuNzY3IDEuNzY4YTIgMiAwIDEgMS0yLjgyOS0yLjgyOWw2LjM2NC02LjM2NGEyIDIgMCAxIDEgMi44MjkgMi44MjlsLTEuNzY4IDEuNzY3YTIgMiAwIDEgMSAyLjgyOCAyLjgyOXoiLz48cGF0aCBkPSJtMjEuNSAyMS41LTEuNC0xLjQiLz48cGF0aCBkPSJNMy45IDMuOSAyLjUgMi41Ii8+PHBhdGggZD0iTTYuNDA0IDEyLjc2OGEyIDIgMCAxIDEtMi44MjktMi44MjlsMS43NjgtMS43NjdhMiAyIDAgMSAxLTIuODI4LTIuODI5bDIuODI4LTIuODI4YTIgMiAwIDEgMSAyLjgyOSAyLjgyOGwxLjc2Ny0xLjc2OGEyIDIgMCAxIDEgMi44MjkgMi44Mjl6Ii8+PC9zdmc+")
icons.set("Ristoranti", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXV0ZW5zaWxzIj48cGF0aCBkPSJNMyAydjdjMCAxLjEuOSAyIDIgMmg0YTIgMiAwIDAgMCAyLTJWMiIvPjxwYXRoIGQ9Ik03IDJ2MjAiLz48cGF0aCBkPSJNMjEgMTVWMmE1IDUgMCAwIDAtNSA1djZjMCAxLjEuOSAyIDIgMmgzWm0wIDB2NyIvPjwvc3ZnPg==")
icons.set("Eventi", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXBhcnR5LXBvcHBlciI+PHBhdGggZD0iTTUuOCAxMS4zIDIgMjJsMTAuNy0zLjc5Ii8+PHBhdGggZD0iTTQgM2guMDEiLz48cGF0aCBkPSJNMjIgOGguMDEiLz48cGF0aCBkPSJNMTUgMmguMDEiLz48cGF0aCBkPSJNMjIgMjBoLjAxIi8+PHBhdGggZD0ibTIyIDItMi4yNC43NWEyLjkgMi45IDAgMCAwLTEuOTYgMy4xMmMuMS44Ni0uNTcgMS42My0xLjQ1IDEuNjNoLS4zOGMtLjg2IDAtMS42LjYtMS43NiAxLjQ0TDE0IDEwIi8+PHBhdGggZD0ibTIyIDEzLS44Mi0uMzNjLS44Ni0uMzQtMS44Mi4yLTEuOTggMS4xMWMtLjExLjctLjcyIDEuMjItMS40MyAxLjIySDE3Ii8+PHBhdGggZD0ibTExIDIgLjMzLjgyYy4zNC44Ni0uMiAxLjgyLTEuMTEgMS45OEM5LjUyIDQuOSA5IDUuNTIgOSA2LjIzVjciLz48cGF0aCBkPSJNMTEgMTNjMS45MyAxLjkzIDIuODMgNC4xNyAyIDUtLjgzLjgzLTMuMDctLjA3LTUtMi0xLjkzLTEuOTMtMi44My00LjE3LTItNSAuODMtLjgzIDMuMDcuMDcgNSAyWiIvPjwvc3ZnPg==")
icons.set("Cinema", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNsYXBwZXJib2FyZCI+PHBhdGggZD0iTTIwLjIgNiAzIDExbC0uOS0yLjRjLS4zLTEuMS4zLTIuMiAxLjMtMi41bDEzLjUtNGMxLjEtLjMgMi4yLjMgMi41IDEuM1oiLz48cGF0aCBkPSJtNi4yIDUuMyAzLjEgMy45Ii8+PHBhdGggZD0ibTEyLjQgMy40IDMuMSA0Ii8+PHBhdGggZD0iTTMgMTFoMTh2OGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMloiLz48L3N2Zz4=");
icons.set("Biblioteche", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWJvb2stbWFya2VkIj48cGF0aCBkPSJNNCAxOS41di0xNUEyLjUgMi41IDAgMCAxIDYuNSAySDIwdjIwSDYuNWEyLjUgMi41IDAgMCAxIDAtNUgyMCIvPjxwb2x5bGluZSBwb2ludHM9IjEwIDIgMTAgMTAgMTMgNyAxNiAxMCAxNiAyIi8+PC9zdmc+");
icons.set("Musei", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWxhbmRtYXJrIj48bGluZSB4MT0iMyIgeDI9IjIxIiB5MT0iMjIiIHkyPSIyMiIvPjxsaW5lIHgxPSI2IiB4Mj0iNiIgeTE9IjE4IiB5Mj0iMTEiLz48bGluZSB4MT0iMTAiIHgyPSIxMCIgeTE9IjE4IiB5Mj0iMTEiLz48bGluZSB4MT0iMTQiIHgyPSIxNCIgeTE9IjE4IiB5Mj0iMTEiLz48bGluZSB4MT0iMTgiIHgyPSIxOCIgeTE9IjE4IiB5Mj0iMTEiLz48cG9seWdvbiBwb2ludHM9IjEyIDIgMjAgNyA0IDciLz48L3N2Zz4=");

const iconColors = {
    standard: "rgba(0, 0, 0, 1)",
    educativi_ricreativi: "rgba(107,191,89,0.6)",
    trasporto_accessibilita: "rgba(200,70,48,0.6)",
    sanitari_quotidiani: "rgba(133,199,242,0.6)",
    culturali_intrattenimento: "rgba(255,173,5,0.6)"
}

const toggleColors = {
    educativi_ricreativi: " data-[state=on]:bg-[rgba(107,191,89,0.6)] data-[state=off]:bg-[rgba(107,191,89,0.1)]",
    trasporto_accessibilita: " data-[state=on]:bg-[rgba(200,70,48,0.6)] data-[state=off]:bg-[rgba(200,70,48,0.1)]",
    sanitari_quotidiani: " data-[state=on]:bg-[rgba(133,199,242,0.6)] data-[state=off]:bg-[rgba(133,199,242,0.1)]",
    culturali_intrattenimento: " data-[state=on]:bg-[rgba(255,173,5,0.6)] data-[state=off]:bg-[rgba(255,173,5,0.1)]"
}

function PoiToggleList(props: any) {
    const [dataPOI, setDataPOI] = useState([]);

    const [activeLayers, setActiveLayers] = useState<Map<string, boolean>>();

    const [educativi_ricreativi_L, setEducativi_ricreativi_L] = useState<LayerInfo[]>([]);
    const [trasporto_accessibilita_L, setTrasporto_accessibilita_L] = useState<LayerInfo[]>([]);
    const [sanitari_quotidiani_L, setsanitari_quotidiani_L] = useState<LayerInfo[]>([]);
    const [culturali_intrattenimento_L, setculturali_intrattenimento_L] = useState<LayerInfo[]>([]);


    useEffect(() => {
        fetch('http://localhost:4000/Poi', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(data => {

                setDataPOI(data);
            })
            .catch(error => {
                console.error('Errore nella fetch:', error);
            });
    }, []);

    useEffect(() => {
        if (!props.map || activeLayers?.keys())
            return;


        let activeLayersTemp: Map<string, boolean> = new Map();

        dataPOI.forEach((dataArray: PoiData[]) => {

            const layerFeatures = dataArray.map((item: PoiData) => {

                const coordinates = fromLonLat([item.longitude, item.latitude]);

                const feature = new Feature({
                    geometry: new Point(coordinates),
                    id: item.id,
                    name: item.name,
                    longitudine: item.longitude,
                    latitudine: item.latitude
                });
                    
                return feature;
            });

            const vectorSource = new VectorSource({
                features: layerFeatures,
            });

            // const clusterSource = new Cluster({
            //     distance: 40,
            //     minDistance: 20,
            //     source: vectorSource,
            // });

            let newLayer = new VectorLayer({
                source: vectorSource,
            });

            let iconSrc: string;

            icons.get(dataArray[0].name) != undefined
                ? iconSrc = icons.get(dataArray[0].name)
                : iconSrc = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNpcmNsZS1oZWxwIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxwYXRoIGQ9Ik05LjA5IDlhMyAzIDAgMCAxIDUuODMgMWMwIDItMyAzLTMgMyIvPjxwYXRoIGQ9Ik0xMiAxN2guMDEiLz48L3N2Zz4=";


            let iconColor: string = iconColors.standard;

            switch (dataArray[0].name) {
                case "Scuole":
                case "Dopo Scuola":
                case "Parchi":
                case "Giochi Bimbi":
                case "Impianti Sportivi":
                    iconColor = iconColors.educativi_ricreativi;
                    break;

                case "Fermate Bus":
                case "Stazioni Treno":
                case "Parcheggi":
                case "Colonnine":
                    iconColor = iconColors.trasporto_accessibilita;
                    break;

                case "Farmacie":
                case "Ospedali":
                case "Supermercati":
                case "Banche":
                    iconColor = iconColors.sanitari_quotidiani;
                    break;

                case "Palestre":
                case "Ristoranti":
                case "Eventi":
                case "Cinema":
                case "Biblioteche":
                case "Musei":
                    iconColor = iconColors.culturali_intrattenimento;
                    break;
            }


            const style = [
                new Style({
                    image: new RegularShape({
                        points: 64,
                        radius: 14,
                        fill: new Fill({
                            color: iconColor
                        })
                    })
                }),
                new Style({
                    image: new Icon({
                        src: iconSrc,
                        scale: 0.7,
                    }),
                })
            ];

            newLayer.setStyle(style)

            props.map.addLayer(newLayer);

            let layerInfo: LayerInfo = {
                layer: newLayer,
                layerIcon: iconSrc,
                layerColor: iconColor,
                layerName: dataArray[0].name
            };

            activeLayersTemp.set(layerInfo.layerName, true);

            switch (iconColor) {
                case iconColors.educativi_ricreativi:
                    educativi_ricreativi_L.push(layerInfo)
                    break;
                case iconColors.trasporto_accessibilita:
                    trasporto_accessibilita_L.push(layerInfo)
                    break;
                case iconColors.sanitari_quotidiani:
                    sanitari_quotidiani_L.push(layerInfo)
                    break;
                case iconColors.culturali_intrattenimento:
                    culturali_intrattenimento_L.push(layerInfo)
                    break;
                default:
                    break;
            }
        });

        setEducativi_ricreativi_L(educativi_ricreativi_L);
        setTrasporto_accessibilita_L(trasporto_accessibilita_L);
        setsanitari_quotidiani_L(sanitari_quotidiani_L);
        setculturali_intrattenimento_L(culturali_intrattenimento_L);

        if(props.setPoiLayers){
            props.setPoiLayers([
                educativi_ricreativi_L,
                trasporto_accessibilita_L,
                sanitari_quotidiani_L,
                culturali_intrattenimento_L
            ])
        }

        setActiveLayers(activeLayersTemp);

    }, [dataPOI]);

    function poiToggleList(layerGroup: LayerInfo[], toggleColor: string) {

        return layerGroup?.map((actualLayer, index: number) => (

            <Toggle
                className={'flex justify-between w-full my-2 ' + toggleColor}
                key={"poiToggle" + actualLayer.layerName + index}
                pressed={activeLayers?.get(actualLayer.layerName)}
                onPressedChange={
                    () => {
                        actualLayer.layer.setVisible(!actualLayer.layer.isVisible());

                        let activeLayersCopy = new Map(activeLayers);
                        activeLayersCopy.set(actualLayer.layerName, !activeLayersCopy.get(actualLayer.layerName));

                        setActiveLayers(activeLayersCopy)
                    }
                }
            >

                <img src={actualLayer.layerIcon} />

                {actualLayer.layerName}
            </Toggle>
        ))
    }

    function hideAllLayer() {
        educativi_ricreativi_L.forEach(element => {
            element.layer.setVisible(false)
        })
        trasporto_accessibilita_L.forEach(element => {
            element.layer.setVisible(false)
        })
        sanitari_quotidiani_L.forEach(element => {
            element.layer.setVisible(false)
        })
        culturali_intrattenimento_L.forEach(element => {
            element.layer.setVisible(false)
        })

        let activeLayersCopy = new Map(activeLayers);

        activeLayersCopy?.forEach(function (value, key) {
            activeLayersCopy.set(key, false);
        })

        setActiveLayers(activeLayersCopy);
    }


    return (
        <div className="flex flex-col flex-1 justify-around h-full">
            <p className="m-3 text-center font-medium leading-none">Quali punti di interesse vuoi visualizzare?</p>
            <ScrollArea className="h-[70vh] rounded-md border p-4">
                <Accordion type="multiple">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Educazione e Relax</AccordionTrigger>
                        <AccordionContent>
                            {poiToggleList(educativi_ricreativi_L, toggleColors.educativi_ricreativi)}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Trasporto e Accessibilità</AccordionTrigger>
                        <AccordionContent>
                            {poiToggleList(trasporto_accessibilita_L, toggleColors.trasporto_accessibilita)}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Sanitari e Quotidiani</AccordionTrigger>
                        <AccordionContent>
                            {poiToggleList(sanitari_quotidiani_L, toggleColors.sanitari_quotidiani)}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>Cultura e Intrattenimento</AccordionTrigger>
                        <AccordionContent>
                            {poiToggleList(culturali_intrattenimento_L, toggleColors.culturali_intrattenimento)}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

            </ScrollArea>

            <Button
                className="w-full"
                variant="destructive"
                onClick={
                    () => hideAllLayer()
                }>
                Nascondi Tutto
            </Button>
        </div>
    );
}

export default PoiToggleList;