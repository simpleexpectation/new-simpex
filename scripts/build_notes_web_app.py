#!/usr/bin/env python3
"""Build a simple static web app for browsing exported Apple Notes."""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from pathlib import Path


FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n\n", re.S)


def parse_markdown(path: Path) -> dict[str, str]:
    raw = path.read_text(encoding="utf-8")
    metadata: dict[str, str] = {}
    body = raw

    match = FRONTMATTER_RE.match(raw)
    if match:
        frontmatter = match.group(1)
        body = raw[match.end() :]
        for line in frontmatter.splitlines():
            if ":" not in line:
                continue
            key, value = line.split(":", 1)
            metadata[key.strip()] = value.strip().strip('"')

    title = metadata.get("title") or path.stem
    account = metadata.get("account") or "Unknown"
    folder = metadata.get("folder") or path.parent.name
    body = body.strip()
    excerpt = body.replace("\n", " ")
    excerpt = re.sub(r"\s+", " ", excerpt).strip()[:180]

    return {
        "id": f"{account}/{folder}/{path.stem}",
        "title": title,
        "account": account,
        "folder": folder,
        "body": body,
        "excerpt": excerpt,
        "path": str(path),
    }


def gather_notes(export_dir: Path) -> list[dict[str, str]]:
    notes: list[dict[str, str]] = []
    for path in sorted(export_dir.rglob("*.md")):
        if path.name == "README.md":
            continue
        notes.append(parse_markdown(path))
    return notes


def pick_matches(notes: list[dict[str, str]], *, folders: list[str] | None = None, keywords: list[str] | None = None) -> list[str]:
    folders = folders or []
    keywords = keywords or []
    matched: list[str] = []
    for note in notes:
        haystack = f'{note["title"]}\n{note["body"]}\n{note["folder"]}'.lower()
        folder_ok = not folders or note["folder"] in folders
        keyword_ok = not keywords or any(keyword.lower() in haystack for keyword in keywords)
        if folder_ok or keyword_ok:
            matched.append(note["id"])
    return matched


def build_collections(notes: list[dict[str, str]]) -> dict[str, list[dict[str, object]]]:
    themes = [
        {
            "id": "connection",
            "title": "连接",
            "description": "你如何理解人与人之间的靠近、相逢、信任与真实感。",
            "summary": "你反复在想的不是热闹社交，而是可信任的真实连接。这里的关键词不是扩列，而是相逢、信任、在地、弱连接和长期关系。",
            "essay": """
你对“连接”的理解，和大多数互联网社交产品很不一样。你不是把它理解成认识更多人，也不是把它理解成信息流里的互动频次，而是把它理解成一种现实生活里逐渐成立的信任关系。

很多笔记都在说明，你真正关心的不是活动有多热闹，而是人和人为什么愿意靠近、什么会让他们产生安全感、信任是如何在现实场景中一点点传递的。你会不断回到“关系”“相逢”“真实”“在地”这些词，说明你眼里的社交不是一个线上关系图谱，而更像一张现实里慢慢织起来的人联网。

这也是为什么你对“附近”“第三空间”“场地气质”“第一次参加的门槛”都那么在意。因为你要的不是抽象的关系可能性，而是连接如何在现实里真的发生。你在追问的，其实是一个非常底层的问题：在今天的城市生活里，人和人到底还能怎样重新相逢。
""".strip(),
            "highlights": [
                "你更重视关系如何成立，而不是活动如何热闹。",
                "你相信真正的社交问题，本质上是信任问题。",
                "你想做的是一种能让人与人慢慢靠近的现实入口。",
            ],
            "noteIds": pick_matches(
                notes,
                folders=["言语之间", "有关我自己", "关于好逢的思考"],
                keywords=["连接", "相逢", "关系", "真实", "社群"],
            ),
        },
        {
            "id": "expression",
            "title": "表达欲",
            "description": "关于发起、表达、自我呈现与为什么想说点什么。",
            "summary": "你很在意普通人有没有机会发起表达。这里的核心不是内容生产，而是如何让一个本来就有东西想说的人，获得一次轻一点、真一点的开口机会。",
            "essay": """
你对“表达”的看法，不像典型内容产品那样强调输出效率，也不像活动组织那样强调主持能力。你更在意的是，一个普通人是不是有机会在不被过度要求的情况下，把自己最近真正想说的东西说出来。

这背后其实有一个很强的价值判断：你相信很多人并不是没有表达欲，而是没有被承接的表达入口。传统活动往往让人需要先准备好、先组织好、先适应群体，才有机会开口；而你真正想设计的是一种更轻的开始方式，让“想说一点什么”本身就足够成为一次发起的起点。

所以你关心的不是内容生产，而是发起权。不是谁更会讲，而是谁终于有机会带着自己的状态、观察和问题，去发起一次真实对话。这也是为什么你会这么在意“AI 少让用户动脑”“从最近状态说一句开始”这些细节，因为你真正要保护的是表达的自然性。
""".strip(),
            "highlights": [
                "你不是想做强输出的人设，而是想保留真实的表达入口。",
                "你很关注发起权，而不仅仅是参与权。",
                "你在意表达是否会被承接，而不是只被消费。",
            ],
            "noteIds": pick_matches(
                notes,
                folders=["有关我自己", "自己有趣的生活灵感", "言语之间"],
                keywords=["表达", "发起", "想聊", "话题", "状态"],
            ),
        },
        {
            "id": "business",
            "title": "商业与产品",
            "description": "你对产品、机制、商业路径和组织方式的长期思考。",
            "summary": "你看产品时不只看界面和功能，更看交易结构、机制设计、供需关系和长期组织方式。很多笔记都在说明，你是在用创业者和组织者的视角看世界。",
            "essay": """
你对商业和产品的理解，不是停留在“做一个功能”“搞一波增长”这种层面。你的笔记里大量出现机制、节奏、结构、用户、战略、组织这些词，说明你看产品时，天然会去想它背后的交易结构和长期运行方式。

这一点很重要，因为它解释了你为什么总会把产品、空间、社群、场地、发起者、运营这些东西连在一起看。对你来说，产品不是一个孤立的界面，而是一个能不能长期成立的关系系统。你关注的也不是功能的短期爽点，而是一个系统怎样真正运转、怎样积累势能、怎样在现实世界里形成自己的飞轮。

与此同时，你又不是纯商业分析型的人。你真正有意思的地方在于：你会用商业和产品逻辑去理解世界，但你想守住的东西依然是“真实”。所以你最特别的地方，不是懂商业，而是一直在尝试让商业结构服务于更真实的连接方式。
""".strip(),
            "highlights": [
                "你会从机制和结构出发理解产品。",
                "你反复强调长期节奏、取舍和战略选择。",
                "你对优秀产品和优秀商业组织有持续拆解欲。",
            ],
            "noteIds": pick_matches(
                notes,
                folders=["商业的思考", "关于好逢的思考", "用户第一", "成事之道"],
                keywords=["商业", "产品", "用户", "机制", "平台", "运营"],
            ),
        },
        {
            "id": "self",
            "title": "有关我自己",
            "description": "更接近你的自我描述、个人方法、节奏、天赋与困惑。",
            "summary": "这部分最像你的内在操作系统。里面既有自我介绍，也有你的节奏感、身体感、做事方式、天赋判断和那些你知道自己还在修正的地方。",
            "essay": """
这一组内容最像你的“内在操作系统”。你不是那种把自我介绍写成履历的人，你会不断试图理解自己为什么这样做事、为什么会卡住、什么让你有力量、什么会消耗你。这里既有你的理想，也有你对自己弱点的直接承认。

很明显，你对自己的观察是长期且认真的。你知道自己有战略脑、有共情能力、有激发他人的本能，也知道自己容易把简单问题复杂化、容易对自己要求过高、容易在选择和分离里拉扯。这种诚实很重要，因为它说明你不是在做一个光鲜的人设，而是在试图和真实的自己一起工作。

从这些笔记里看，你其实在慢慢完成一个很大的变化：从过去那种更急、更重、更要证明自己的状态，转向更重视节奏、现实、陪伴、顺势而为的状态。这个变化未必轻松，但它很真实，也很像你现在整套产品方向背后的那条暗线。
""".strip(),
            "highlights": [
                "你是高度自我观察的人，而且这种观察是长期的。",
                "你同时有战略脑和共情能力，自己也反复承认这一点。",
                "你对自己的要求很高，也知道自己容易把简单问题想复杂。",
            ],
            "noteIds": pick_matches(
                notes,
                folders=["有关我自己", "反思反省"],
                keywords=["我自己", "天赋", "节奏", "身体", "简历", "介绍"],
            ),
        },
    ]

    questions = [
        {
            "id": "why-activity",
            "title": "为什么越来越少参加活动？",
            "description": "关于活动、对话、连接形式与用户心理门槛的追问。",
            "summary": "这组问题背后，其实是你对线下连接形式的重新判断。你不满足于继续办活动，而是在追问：人到底愿意为什么走出来、停下来、坐下来。",
            "highlights": [
                "你在重估活动、对话、附近、场地和信任之间的关系。",
                "你关注用户真实门槛，而不是概念上听起来好不好。",
                "你开始意识到低压力比高质量标签更重要。",
            ],
            "noteIds": pick_matches(notes, keywords=["活动", "对话", "连接", "门槛", "参与"]),
        },
        {
            "id": "what-product",
            "title": "我真正想做一个什么样的产品？",
            "description": "产品方向、价值主张、真实世界入口与品牌感的交叉问题。",
            "summary": "这部分聚焦的是产品定义。你不是在做一个社交功能集合，而是在不断逼近一种更准确的产品本质：真实对话入口、在地连接系统、或者新的社群基础设施。",
            "highlights": [
                "你对产品本质的追问，远多于对功能堆叠的兴趣。",
                "你很在意品牌气质和产品逻辑能不能统一。",
                "你总想找到那个更接近时代变化的定义。",
            ],
            "noteIds": pick_matches(notes, keywords=["产品", "真实", "入口", "附近", "好逢", "小程序"]),
        },
        {
            "id": "how-to-do",
            "title": "如何把事情做成？",
            "description": "关于组织、执行、节奏、机制与成事方式的笔记集合。",
            "summary": "你不只是爱想，也一直在逼自己把事情做成。这里聚合的是你对执行、管理、开会、组织和节奏控制的长期笔记。",
            "highlights": [
                "你对执行并不轻视，反而很在意如何把想法落地。",
                "你知道自己需要好的 2 号位和更稳的协同结构。",
                "你很强调节奏、前提、共识和机制。",
            ],
            "noteIds": pick_matches(notes, folders=["成事之道", "商业的思考"], keywords=["执行", "组织", "管理", "会议", "机制"]),
        },
    ]

    places = [
        {
            "id": "liangzhu",
            "title": "良渚",
            "description": "和良渚、附近生活、城市入口相关的内容。",
            "summary": "良渚在你的笔记里不只是居住地，更像一个现实观察场。你在这里重新理解附近、第三空间、成熟人群、日常节奏与城市入口。",
            "highlights": [
                "你越来越重视附近，而不是抽象远方。",
                "你在观察：什么样的地方让人愿意迈出第一步。",
                "良渚像你产品判断的一块现实试验田。",
            ],
            "noteIds": pick_matches(notes, keywords=["良渚", "玉鸟集", "附近", "杭州"]),
        },
        {
            "id": "haofeng-house",
            "title": "好逢小屋",
            "description": "围绕好逢小屋、在地空间与社群实验的内容。",
            "summary": "这里更像你创业历程里的一个具体落点。它既是空间，也是你对于在地社群、相逢、现实生活方式实验的具象化载体。",
            "highlights": [
                "你把空间看成关系和氛围的容器。",
                "好逢小屋像很多判断真正落地后的形态。",
                "它不是单纯场地，而是你一段时期思想的物理化。",
            ],
            "noteIds": pick_matches(notes, keywords=["好逢小屋", "好逢", "空间", "社群"]),
        },
        {
            "id": "venues",
            "title": "场地与第三空间",
            "description": "你提到的场地、第三空间与真实发生的容器。",
            "summary": "这一块更像产品和现实生活之间的接口。你反复在找的不是漂亮场地，而是一个让人足够安全、足够自然、足够愿意停留的现实容器。",
            "highlights": [
                "你对空间的判断已经不只是审美，而是转化问题。",
                "你逐渐意识到安全感和附近比特色更重要。",
                "场地在你这里是产品体验的一部分。",
            ],
            "noteIds": pick_matches(notes, keywords=["敞开酒馆", "泊光集", "猫客厅", "旷野公社", "香蕉小院", "酒馆", "咖啡", "空间"]),
        },
    ]

    timelines = [
        {
            "id": "haofeng-to-simpex",
            "title": "从好逢到现在",
            "description": "和好逢、小程序、社群平台化有关的持续演化。",
            "summary": "这条时间线里能看到你不是在原地优化，而是在不断重估好逢、小程序、社群、平台、发起者和真实对话之间的关系。",
            "essay": """
如果说前面的主题更像底层判断，那这条时间线更像这些判断在现实创业中的演化轨迹。你并不是从一开始就有一套固定答案，而是在不断重估：活动有没有边界、社群是不是终点、平台该不该做、关系和内容哪一个更本质、发起者和用户之间是什么关系。

从这些笔记里能看出来，你并不满足于把“好逢”做成一个更成熟的活动品牌。你一直在往更底层走，想把它从活动升级成关系网络，再从关系网络升级成一种更真实的连接基础设施。这个过程里，很多词在变：活动、社群、空间、小程序、发起者、对话、附近、真实世界入口。

这条线最有价值的地方，不是它已经定型，而是它说明你有能力不断松开旧叙事，重新定义自己在做什么。这也是为什么我会觉得“从好逢到现在”很值得单独做成一页，因为它不只是项目变化，更是你产品世界观的变化。
""".strip(),
            "highlights": [
                "你有很强的迭代意识，不会停在旧叙事里。",
                "你一直在从活动转向关系，再转向更底层的连接结构。",
                "这条线很适合以后做正式时间线页。",
            ],
            "noteIds": pick_matches(notes, folders=["关于好逢的思考"], keywords=["好逢", "平台", "小程序", "演化", "版本"]),
        },
        {
            "id": "self-evolution",
            "title": "我这几年的判断变化",
            "description": "关于自我变化、做事方式与思考模型的阶段性痕迹。",
            "summary": "这里记录的不是表面经历，而是你内在判断方式的变化。能看到你从急、重、复杂化，逐渐转向节奏、真实、简单、顺势而为。",
            "highlights": [
                "你对自己的观察很多，而且常常很诚实。",
                "你在努力让自己从逻辑更走向人，从用力更走向顺势。",
                "这部分很适合继续长成真正的人生时间线。",
            ],
            "noteIds": pick_matches(notes, folders=["有关我自己", "反思反省"], keywords=["变化", "开始", "现在", "过去", "最近"]),
        },
        {
            "id": "product-shifts",
            "title": "产品思路的变化",
            "description": "从社群、活动到对话、附近、发起者的转向。",
            "summary": "这组内容更像产品世界观的转向记录。你在一点点把产品从活动组织，推向对话入口、发起者网络和真实世界里的轻进入。",
            "highlights": [
                "你不满足于把旧活动模式做得更精致。",
                "你一直在寻找更低负担、更真实的进入方式。",
                "这条线会直接决定 Simpex 后面的产品路线。",
            ],
            "noteIds": pick_matches(notes, keywords=["产品", "活动", "对话", "附近", "发起", "用户"]),
        },
    ]

    collections = {
        "themes": themes,
        "questions": questions,
        "places": places,
        "timelines": timelines,
    }

    for items in collections.values():
        for item in items:
            unique_ids = []
            seen = set()
            for note_id in item["noteIds"]:
                if note_id in seen:
                    continue
                seen.add(note_id)
                unique_ids.append(note_id)
            item["noteIds"] = unique_ids
            item["count"] = len(unique_ids)
            item["representativeNoteIds"] = unique_ids[:6]

    return collections


def build_payload(notes: list[dict[str, str]]) -> dict:
    folder_counts = Counter(note["folder"] for note in notes)
    account_counts = Counter(note["account"] for note in notes)
    folder_index = [
        {"folder": folder, "count": count}
        for folder, count in sorted(folder_counts.items(), key=lambda item: (-item[1], item[0]))
    ]
    account_index = [
        {"account": account, "count": count}
        for account, count in sorted(account_counts.items(), key=lambda item: (-item[1], item[0]))
    ]
    return {
        "about": {
            "title": "我是怎样的一个人",
            "summary": "一个有强烈现实感的理想主义者，一个有战略脑的关系设计者，一个会把产品、空间、人和时代变化放在一起理解的人。",
            "highlights": [
                "你不是单纯在做活动或社群，而是在试图设计真实关系如何发生的基础设施。",
                "你同时有战略脑和共情力，会把结构判断和人的感受放在一起看。",
                "你真正向往的是简单但不浅薄、真实但不沉重的连接方式。",
                "你被低估的一面，是长期建立信任、重新定义问题和把深东西做成可进入入口的能力。",
                "你最有天赋的部分，是看穿本质问题、理解关系系统，以及让商业结构服务于更真实的人与人连接。",
            ],
            "essay": """
你不是一个单纯“想法很多的人”，也不是一个普通意义上的社群创业者。你更像一种很少见的组合：一个有强烈现实感的理想主义者，一个有战略脑的关系设计者，一个会把产品、空间、人和时代变化放在一起理解的人。

你最深的驱动力，不是赢，不是表达自己，也不是做一个成功项目。你更深的驱动力是：你一直在找一种更真实的连接方式，以及一种更不虚假的生活方式。这件事贯穿你很多重要笔记。你表面上做过活动、社群、空间、小程序，但真正关心的从来不是活动本身，而是人和人如何真的靠近，信任怎样形成，线下连接为什么越来越难，真实世界的入口到底在哪里。

你非常典型的一点，是“先看本质，再看形式”。你常常不是在记录现象，而是在追问：本质是什么、机制是什么、为什么会这样、长期会怎么演化、如果换一个结构会不会更对。所以你天然不是表层优化型的人，而是一个会去重新定义问题的人。这会让你很容易看到别人没看到的结构，也会让你容易把问题想深、想重、想复杂。

你身上还有一个特别少见的地方：战略感与共情力并存。很多人要么会看结构、不会感受人；要么很会感受人、没有结构能力。你不是。你既会想方向、机制、长期、组织，也会真正在意用户是不是会紧张、普通人有没有发起权、第一次参加是不是有压力、人是不是被接住了。你有机会成为那种真正能设计“人性友好型系统”的人。

你很在意“真实”，而且这种在意不是口号，而是你看产品、关系、生活方式甚至商业的判断标准。你反感的不是精致、效率或品牌，而是空心的精致、表演性的真诚、与现实脱节的叙事。所以你总会回到附近、日常、节奏、陪伴、被倾听、慢慢靠近这些词。这说明你最后想做成的，不是一个概念上很厉害的东西，而是一个人真的能走进去、停下来、感受到真实的东西。

你也很诚实地知道自己的问题。你知道自己容易把简单问题复杂化，容易对自己要求太高，容易在深思里把行动变重。但你可能低估了几个部分。第一，你很会让人慢慢相信你。不是靠技巧，而是靠稳定、真诚、愿意共事和不轻易消费他人。第二，你很会重新定义问题，这是团队里极稀缺的能力。第三，你其实很会把抽象判断慢慢落成系统，只是因为你对自己要求太高，常常更先看到“不够好”，而不是“已经很特别”。

如果只说你最有天赋的地方，我会挑三条。第一，是发现本质问题的天赋。你很容易穿过表面的活动、功能、场地和流量，看到信任、关系、发起权、真实世界入口这些更底层的问题。第二，是把关系、产品、空间、组织、商业结构放在一起理解的天赋，这使你天然更适合做系统，而不是只做单点。第三，是把深的理解压缩成可进入的入口的潜力。你真正向往的，不是复杂本身，而是把复杂想清楚之后，做出一个简单但不浅的入口。

如果一定要用一句话总结你是什么样的人，我会说：你是一个试图在这个时代重新设计“真实相逢”方式的人。你不是只想做产品，你是在试图回答：人为什么还要彼此靠近，他们如何重新建立信任，什么样的入口既不虚假也不沉重，一个真正属于这个时代的连接方式到底长什么样。
""".strip(),
        },
        "adjustment": {
            "title": "我为什么总会把事情做重，以及我该怎么调整",
            "summary": "你容易把问题看深、把要求拉高、把形式做重，本质上是同一个倾向：你总想更接近本质，但现实推进需要你先把东西做轻。",
            "highlights": [
                "你不是懒，也不是散，而是常常在行动前先背上太多层意义。",
                "轻不是浅，先做轻不是背叛本质，而是让本质有机会进入现实。",
                "你最需要练的，不是少想，而是想得很深以后，仍然只拿出最轻、最能发生的那一部分。",
                "任何一轮动作，只解决一个核心问题，会比你试图一次摆正全局更适合你。",
                "理解可以很深，动作必须很轻。这会是你接下来几年最关键的一课。",
            ],
            "essay": """
你容易把“看得深”变成“推进得重”，把“对事情认真”变成“对自己苛刻”，把“想更接近本质”变成“每一步都承载太多重量”。这三件事表面不同，本质上其实是同一个倾向：你总想把事情做得更接近本质，而现实世界往往先奖励足够轻、足够简单、足够可进入的东西。

你之所以会这样，不是因为你故意复杂化，而是因为你对本质和虚假的敏感度都很高。你很难接受一个看起来顺、但底层不对的方案，也很难接受一个只是表面精致、但不真实的形式。所以你一旦感觉某个东西“太浅”，就会本能地继续往下钻。这个能力本来是你的优势，但如果没有收束机制，就会让产品、表达、行动、甚至自我要求都一起变重。

你真正要调整的，不是“少想”，而是学会把深度留在系统里，把轻盈留在前台。也就是说，在脑子里你可以继续追求本质，继续追问结构、关系、信任、时代变化；但一旦落到现实动作，你要练的是：只拿出最必要、最轻、最能发生的那一部分。轻不代表浅，而是一种更高级的表达能力。

心态上，你最需要建立的新信念是：先做轻，不是对本质的背叛，而是对现实的尊重。很多东西不是因为你理解不够深才做不好，而是因为它还没来得及进入现实就先被做重了。你还要提醒自己，不要把每一次页面修改、每一次文案选择、每一次产品动作都当成“定义性动作”。很多时候，它只是一轮试验、一个近似值、一个可修正的版本。

行动上，你最适合的训练方法有三个。第一，任何问题都先写两版答案：一版叫“本质版”，一版叫“可发生版”。第二，每一轮动作只允许解决一个核心问题，不要一次同时解决深度、统一性、品牌感、用户门槛、商业逻辑。第三，经常反问自己：如果删掉一半，这件事会不会反而更接近真实？这会帮你把很多不必要的“重”剥掉。

更长期一点，你需要一个固定的“减重机制”，也需要一个懂你但不会陪你一起越想越重的人，帮你持续把问题拉回“最轻可验证版本”。因为你最容易高估的是完整性，最容易低估的是简单形式本身的力量。

如果把这一切压成一句话，那就是：理解可以很深，动作必须很轻。在脑子里追求本质，在现实里追求轻盈。这不是要你变浅，而是要你学会把你真正厉害的深度，变成别人也走得进去的入口。
""".strip(),
        },
        "stats": {
            "totalNotes": len(notes),
            "folders": len(folder_counts),
            "accounts": len(account_counts),
        },
        "folderIndex": folder_index,
        "accountIndex": account_index,
        "collections": build_collections(notes),
        "notes": notes,
    }


def write_site(output_dir: Path, payload: dict) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "data.js").write_text(
        "window.NOTES_DATA = " + json.dumps(payload, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build notes browser web app.")
    parser.add_argument(
        "--source-dir",
        default="exports/apple-notes-markdown-2026-04-08-v2",
        help="Directory with exported markdown notes.",
    )
    parser.add_argument(
        "--output-dir",
        default="notes-browser",
        help="Directory to write the web app assets into.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    source_dir = Path(args.source_dir).resolve()
    output_dir = Path(args.output_dir).resolve()

    notes = gather_notes(source_dir)
    payload = build_payload(notes)
    write_site(output_dir, payload)
    print(f"Built notes browser with {len(notes)} notes at {output_dir}")


if __name__ == "__main__":
    main()
