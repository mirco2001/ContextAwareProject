import { Fill, Icon, Stroke, Style } from "ol/style";
import TextOl from 'ol/style/Text.js';

export const geofenceNormalStyle = new Style({
    fill: new Fill({
        color: 'rgba(255, 255, 255, 0.5)',
    }),
    stroke: new Stroke({
        color: 'rgb(0, 0, 0)',
        width: 2,
    }),
    image: new Icon({
        anchor: [0.5, 1],
        src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLW1hcC1waW4iPjxwYXRoIGQ9Ik0yMCAxMGMwIDYtOCAxMi04IDEycy04LTYtOC0xMmE4IDggMCAwIDEgMTYgMFoiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSIzIi8+PC9zdmc+'
    })
});

// - stile geofence selezionate
export const geofenceDeleteStyle = new Style({
    fill: new Fill({
        color: 'rgba(255, 99, 71, 0.6)',
    }),
    stroke: new Stroke({
        color: 'rgba(255, 99, 71, 0.8)',
        width: 2,
    }),
});

export const geofenceHlightStyle = new Style({
    fill: new Fill({
        color: 'rgba(0, 0, 0, 0.6)',
    }),
    stroke: new Stroke({
        color: 'rgb(0, 0, 0)',
        width: 2,
    }),
});

export function normalStyleWithName(zoneName: string) {
    let newStyle: Style = geofenceNormalStyle.clone();

    let zoneNameText: TextOl = new TextOl({
        text: zoneName,
        font: 'bold 12px Arial',
        fill: new Fill({
            color: '#000000'
        }),
        stroke: new Stroke({
            color: '#ffffff',
            width: 3
        })
    })

    newStyle.setText(zoneNameText)

    return newStyle
}

// funzione che restituisce il giusto stile basandosi su:
// - zona 
// - data
// che gli sono stati passati  
export function coloredStyleWithName(zoneName: string, color: string) {

    let newStyle: Style = new Style({
        fill: new Fill({
            color: color,
        }),
        stroke: new Stroke({
            color: 'rgb(0, 0, 0)',
            width: 2,
        })
    });


    let zoneNameText: TextOl = new TextOl({
        text: zoneName,
        font: 'bold 12px Arial',
        fill: new Fill({
            color: '#000000'
        }),
        stroke: new Stroke({
            color: '#ffffff',
            width: 3
        })
    })

    newStyle.setText(zoneNameText)

    return newStyle
}