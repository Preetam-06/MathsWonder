GOLDEN = 0.618

def analyze_song(duration, events):
    """
    duration: total song time (seconds)
    events: list of dicts -> {"label": str, "time": seconds}
    """
    results = []

    for e in events:
        pos = e["time"] / duration
        dist = abs(pos - GOLDEN)

        results.append({
            "label": e["label"],
            "time": e["time"],
            "position": round(pos, 3),
            "distance": round(dist, 3)
        })

    closest = min(results, key=lambda x: x["distance"])
    score = round(1 - closest["distance"], 3)

    return results, closest, score


def remove_event_and_reanalyze(duration, events, index):
    new_events = events[:index] + events[index + 1:]
    return analyze_song(duration, new_events)
