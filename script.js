let currentLanguage = "en";

const csvData = {
    condensed: [],
    electrochemistry: [],
    fluid: []
};

const animationTimers = {
    condensed: null,
    electrochemistry: null,
    fluid: null
};

const animationPhase = {
    condensed: 0,
    electrochemistry: 0,
    fluid: 0
};

const translations = {
    en: {
        siteTitle: "Young Simulation Platform",
        siteSubtitle: "Dynamic computational simulation platform",

        navCondensed: "Computational Condensed Matter Physics",
        navElectrochemistry: "Computational Electrochemistry",
        navFluid: "Computational Fluid Mechanics",

        heroTitle: "Young Simulation Platform",
        heroText: "An interactive simulation and visualization platform with customizable geometry, materials, boundary conditions, solver settings, axis labels and dynamic rendering.",

        condensedTitle: "Computational Condensed Matter Physics",
        condensedDesc: "Electronic structure, transport and crystal structure modeling.",

        electrochemistryTitle: "Computational Electrochemistry",
        electrochemistryDesc: "Interface, reaction kinetics and coupled electrochemical fields.",

        fluidTitle: "Computational Fluid Mechanics",
        fluidDesc: "Wave, boundary layer and turbulence field visualization.",

        modelBuilder: "Model Builder",
        selectModel: "Select model",

        electronicStructure: "Electronic Structure Calculation",
        transportTheory: "Transport Theory Simulation",
        crystalStructure: "Crystal Structure Calculation",

        interfaceElectrochemistry: "Interfacial Electrochemistry Calculation",
        reactionKinetics: "Electrochemical Reaction Kinetics Simulation",
        multiphysicsElectrochemistry: "Multiphysics Electrochemical Simulation",

        waveTheory: "Fluid Wave Theory",
        boundaryLayer: "Boundary Layer Theory",
        turbulenceTheory: "Turbulence Theory Simulation",

        runSimulation: "Run Simulation",
        animate: "Animate",
        stop: "Stop",
        clear: "Clear",
        downloadCsv: "Download CSV",
        downloadPng: "Download PNG",

        footerText: "Dynamic computational simulation and visualization platform"
    },

        zh: {
        siteTitle: "Young Simulation Platform",
        siteSubtitle: "动态计算模拟平台",

        navCondensed: "计算凝聚态物理",
        navElectrochemistry: "计算电化学",
        navFluid: "计算流体力学",

        heroTitle: "Young Simulation Platform",
        heroText: "支持几何、材料、边界条件、求解设置、坐标轴名称和动态渲染的交互式模拟与可视化平台。",

        condensedTitle: "计算凝聚态物理",
        condensedDesc: "电子结构、输运和晶体结构建模。",

        electrochemistryTitle: "计算电化学",
        electrochemistryDesc: "界面、反应动力学和耦合电化学场模拟。",

        fluidTitle: "计算流体力学",
        fluidDesc: "波动、边界层和湍流场可视化。",

        modelBuilder: "模型构建器",
        selectModel: "选择模型",

        electronicStructure: "电子结构计算",
        transportTheory: "输运理论模拟",
        crystalStructure: "晶体结构计算",

        interfaceElectrochemistry: "界面电化学计算",
        reactionKinetics: "电化学反应动力学模拟",
        multiphysicsElectrochemistry: "多物理场电化学模拟",

        waveTheory: "流体波动理论",
        boundaryLayer: "边界层理论",
        turbulenceTheory: "湍流理论模拟",

        runSimulation: "运行模拟",
        animate: "动态模拟",
        stop: "停止",
        clear: "清空",
        downloadCsv: "下载 CSV",
        downloadPng: "下载 PNG",

        footerText: "动态计算模拟与可视化平台"
    }
};

/* =========================
   Parameter builders
   ========================= */

function group(en, zh) {
    return {
        type: "group",
        label: { en, zh }
    };
}

function pn(id, enLabel, zhLabel, value, min, max, step) {
    return {
        type: "number",
        id,
        label: { en: enLabel, zh: zhLabel },
        value,
        min,
        max,
        step
    };
}

function ps(id, enLabel, zhLabel, value, options) {
    return {
        type: "select",
        id,
        label: { en: enLabel, zh: zhLabel },
        value,
        options
    };
}

function pt(id, enLabel, zhLabel, value, placeholderEn, placeholderZh) {
    return {
        type: "text",
        id,
        label: { en: enLabel, zh: zhLabel },
        value,
        placeholder: {
            en: placeholderEn,
            zh: placeholderZh
        }
    };
}

function pa(id, enLabel, zhLabel, value, placeholderEn, placeholderZh) {
    return {
        type: "textarea",
        id,
        label: { en: enLabel, zh: zhLabel },
        value,
        placeholder: {
            en: placeholderEn,
            zh: placeholderZh
        }
    };
}

const geometryOptions = [
    { value: "block", label: { en: "Block", zh: "长方体" } },
    { value: "film", label: { en: "Thin film", zh: "薄膜" } },
    { value: "channel", label: { en: "Channel", zh: "通道" } },
    { value: "cylinder", label: { en: "Cylinder", zh: "圆柱" } },
    { value: "sphere", label: { en: "Sphere", zh: "球体" } },
    { value: "porous", label: { en: "Porous medium", zh: "多孔介质" } }
];

const boundaryOptions = [
    { value: "dirichlet", label: { en: "Dirichlet", zh: "固定值边界" } },
    { value: "neumann", label: { en: "Neumann", zh: "通量边界" } },
    { value: "periodic", label: { en: "Periodic", zh: "周期边界" } },
    { value: "open", label: { en: "Open", zh: "开放边界" } },
    { value: "wall", label: { en: "Wall / no-slip", zh: "壁面 / 无滑移" } }
];

const materialOptions = [
    { value: "metal", label: { en: "Metal", zh: "金属" } },
    { value: "semiconductor", label: { en: "Semiconductor", zh: "半导体" } },
    { value: "oxide", label: { en: "Oxide", zh: "氧化物" } },
    { value: "electrolyte", label: { en: "Electrolyte", zh: "电解液" } },
    { value: "water", label: { en: "Water", zh: "水" } },
    { value: "custom", label: { en: "Custom", zh: "自定义材料" } }
];

function axisParams(xDefault, yDefault, zDefault) {
    return [
        group("Axis Labels", "坐标轴名称"),
        pt(
            "xAxisLabel",
            "x-axis label",
            "x 轴名称",
            xDefault,
            "Example: k<sub>x</sub> / Å<sup>-1</sup> or k_x / Å^-1",
            "示例：k<sub>x</sub> / Å<sup>-1</sup> 或 k_x / Å^-1"
        ),
        pt(
            "yAxisLabel",
            "y-axis label",
            "y 轴名称",
            yDefault,
            "Example: k<sub>y</sub> / Å<sup>-1</sup> or k_y / Å^-1",
            "示例：k<sub>y</sub> / Å<sup>-1</sup> 或 k_y / Å^-1"
        ),
        pt(
            "zAxisLabel",
            "z-axis label",
            "z 轴名称",
            zDefault,
            "Example: E<sub>F</sub> / eV or E_F / eV",
            "示例：E<sub>F</sub> / eV 或 E_F / eV"
        )
    ];
}

function commonParams(defaultGeometry = "block", xDefault = "x", yDefault = "y", zDefault = "z") {
    return [
        group("Geometry", "几何结构"),
        ps("geometry", "Geometry type", "几何类型", defaultGeometry, geometryOptions),
        pn("lx", "Size Lx", "尺寸 Lx", 12, 1, 200, 1),
        pn("ly", "Size Ly", "尺寸 Ly", 10, 1, 200, 1),
        pn("lz", "Size Lz", "尺寸 Lz", 8, 1, 200, 1),
        pn("porosity", "Porosity", "孔隙率", 0.25, 0, 0.9, 0.01),

        group("Material", "材料"),
        ps("material", "Material", "材料类型", "custom", materialOptions),
        pn("conductivity", "Conductivity", "电导率", 1.0, 0.001, 1000, 0.1),
        pn("diffusivity", "Diffusivity", "扩散系数", 1.0, 0.001, 100, 0.1),
        pn("mobility", "Mobility", "迁移率", 1.0, 0.001, 100, 0.1),

        group("Boundary Conditions", "边界条件"),
        ps("boundary", "Boundary condition", "边界条件", "periodic", boundaryOptions),

        group("Solver & Visualization", "求解与可视化"),
        pn("resolution", "Resolution", "分辨率", 52, 20, 120, 1),
        pn("fieldScale", "Field scale", "场强缩放", 1.0, 0.01, 20, 0.1),
        pn("perturbation", "Dynamic perturbation", "动态扰动", 0.15, 0, 2, 0.01),

        ...axisParams(xDefault, yDefault, zDefault)
    ];
}

/* =========================
   Model definitions
   ========================= */

const models = {
    condensed: {
        selectId: "condensedModel",
        paramsId: "condensedParams",
        plotId: "condensedPlot",
        titleId: "condensedPlotTitle",
        descriptionId: "condensedDescription",

        electronicStructure: {
            title: { en: "Electronic Structure Calculation", zh: "电子结构计算" },
            description: {
                en: "Band-surface visualization with editable lattice, hopping parameters, axis labels and custom dispersion.",
                zh: "能带曲面可视化，可编辑晶格、跃迁参数、坐标轴名称和自定义色散关系。"
            },
            params: [
                ...commonParams(
                    "film",
                    "k<sub>x</sub> / Å<sup>-1</sup>",
                    "k<sub>y</sub> / Å<sup>-1</sup>",
                    "E / eV"
                ),
                group("Electronic Model", "电子模型"),
                pn("tx", "Hopping tx / eV", "x 方向跃迁 tx / eV", 1.0, 0.01, 10, 0.05),
                pn("ty", "Hopping ty / eV", "y 方向跃迁 ty / eV", 1.0, 0.01, 10, 0.05),
                pn("epsilon0", "On-site energy / eV", "在位能 / eV", 0, -10, 10, 0.1),
                pn("ax", "Lattice constant ax", "晶格常数 ax", 1.0, 0.2, 10, 0.1),
                pn("ay", "Lattice constant ay", "晶格常数 ay", 1.0, 0.2, 10, 0.1),
                ps("expressionMode", "Dispersion mode", "色散模式", "builtin", [
                    { value: "builtin", label: { en: "Built-in tight-binding", zh: "内置紧束缚模型" } },
                    { value: "custom", label: { en: "Custom expression", zh: "自定义表达式" } }
                ]),
                pa(
                    "customExpression",
                    "Custom E(kx, ky, t)",
                    "自定义 E(kx, ky, t)",
                    "epsilon0 - 2*tx*Math.cos(kx*ax) - 2*ty*Math.cos(ky*ay)",
                    "Use variables: kx, ky, t, tx, ty, ax, ay, epsilon0",
                    "可用变量：kx, ky, t, tx, ty, ax, ay, epsilon0"
                )
            ],
            run: runElectronicStructure
        },

        transportTheory: {
            title: { en: "Transport Theory Simulation", zh: "输运理论模拟" },
            description: {
                en: "Current-density vector field in a configurable material domain.",
                zh: "可配置材料区域中的电流密度矢量场。"
            },
            params: [
                ...commonParams("block", "x / nm", "y / nm", "z / nm"),
                group("Transport Model", "输运模型"),
                pn("electricField", "Electric field", "电场强度", 1.0, 0.01, 50, 0.1),
                pn("carrierDensity", "Carrier density", "载流子浓度", 1.0, 0.01, 100, 0.1),
                pn("vectorDensity", "Vector density", "矢量密度", 7, 4, 12, 1)
            ],
            run: runTransport
        },

        crystalStructure: {
            title: { en: "Crystal Structure Calculation", zh: "晶体结构计算" },
            description: {
                en: "Crystal builder with lattice constants, cell numbers, basis selection and axis labels.",
                zh: "晶体构建器，可设置晶格常数、晶胞数量、基元和坐标轴名称。"
            },
            params: [
                group("Crystal Geometry", "晶体结构"),
                ps("latticeType", "Lattice type", "晶格类型", "sc", [
                    { value: "sc", label: { en: "Simple cubic", zh: "简单立方" } },
                    { value: "bcc", label: { en: "Body-centered cubic", zh: "体心立方" } },
                    { value: "fcc", label: { en: "Face-centered cubic", zh: "面心立方" } }
                ]),
                pn("a", "Lattice constant a", "晶格常数 a", 1.0, 0.2, 10, 0.1),
                pn("b", "Lattice constant b", "晶格常数 b", 1.0, 0.2, 10, 0.1),
                pn("c", "Lattice constant c", "晶格常数 c", 1.0, 0.2, 10, 0.1),
                pn("nx", "Cells along x", "x 方向晶胞数", 7, 1, 20, 1),
                pn("ny", "Cells along y", "y 方向晶胞数", 7, 1, 20, 1),
                pn("nz", "Cells along z", "z 方向晶胞数", 5, 1, 20, 1),
                pn("vibration", "Vibration amplitude", "振动幅度", 0.06, 0, 1, 0.01),
                ...axisParams("x / Å", "y / Å", "z / Å")
            ],
            run: runCrystal
        }
    },

    electrochemistry: {
        selectId: "electrochemistryModel",
        paramsId: "electrochemistryParams",
        plotId: "electrochemistryPlot",
        titleId: "electrochemistryPlotTitle",
        descriptionId: "electrochemistryDescription",

        interfaceElectrochemistry: {
            title: { en: "Interfacial Electrochemistry Calculation", zh: "界面电化学计算" },
            description: {
                en: "Electrode-electrolyte potential field with customizable geometry and screening length.",
                zh: "电极-电解液界面电势场，可自定义几何和屏蔽长度。"
            },
            params: [
                ...commonParams("film", "x / nm", "y / nm", "z / nm"),
                group("Interface Model", "界面模型"),
                pn("phi0", "Surface potential / V", "表面电势 / V", 0.35, -3, 3, 0.05),
                pn("lambdaD", "Screening length", "屏蔽长度", 3.0, 0.1, 50, 0.1),
                pn("roughness", "Surface roughness", "表面粗糙度", 0.2, 0, 2, 0.01)
            ],
            run: runInterfaceElectrochemistry
        },

        reactionKinetics: {
            title: { en: "Electrochemical Reaction Kinetics Simulation", zh: "电化学反应动力学模拟" },
            description: {
                en: "Butler-Volmer kinetic surface with editable electrochemical parameters.",
                zh: "Butler-Volmer 动力学曲面，可编辑电化学参数。"
            },
            params: [
                group("Kinetic Parameters", "动力学参数"),
                pn("i0", "Exchange current density", "交换电流密度", 1.0, 0.001, 100, 0.1),
                pn("alpha", "Charge transfer coefficient", "电荷转移系数", 0.5, 0.05, 0.95, 0.01),
                pn("etaMax", "Maximum overpotential / V", "最大过电位 / V", 0.55, 0.05, 2, 0.05),
                pn("tMin", "Minimum temperature / K", "最低温度 / K", 280, 240, 500, 1),
                pn("tMax", "Maximum temperature / K", "最高温度 / K", 360, 260, 800, 1),
                pn("resolution", "Resolution", "分辨率", 60, 25, 130, 1),
                pn("perturbation", "Dynamic perturbation", "动态扰动", 0.08, 0, 1, 0.01),
                ...axisParams("η / V", "T / K", "j / A cm<sup>-2</sup>")
            ],
            run: runReactionKinetics
        },

        multiphysicsElectrochemistry: {
            title: { en: "Multiphysics Electrochemical Simulation", zh: "多物理场电化学模拟" },
            description: {
                en: "Coupled concentration field around an active electrode geometry.",
                zh: "活性电极几何附近的耦合浓度场。"
            },
            params: [
                ...commonParams("porous", "x / μm", "y / μm", "z / μm"),
                group("Coupled Field", "耦合场"),
                pn("c0", "Bulk concentration", "体相浓度", 1.0, 0.01, 10, 0.1),
                pn("reactionStrength", "Reaction strength", "反应强度", 1.0, 0.01, 20, 0.1),
                pn("diffusionLength", "Diffusion length", "扩散长度", 18, 1, 100, 1)
            ],
            run: runMultiphysicsElectrochemistry
        }
    },

    fluid: {
        selectId: "fluidModel",
        paramsId: "fluidParams",
        plotId: "fluidPlot",
        titleId: "fluidPlotTitle",
        descriptionId: "fluidDescription",

        waveTheory: {
            title: { en: "Fluid Wave Theory", zh: "流体波动理论" },
            description: {
                en: "Free-surface wave model with geometry selection, damping and custom expression.",
                zh: "自由液面波模型，支持几何选择、阻尼和自定义表达式。"
            },
            params: [
                ...commonParams("channel", "x / m", "y / m", "η<sub>surface</sub> / m"),
                group("Wave Model", "波动模型"),
                pn("amplitude", "Amplitude", "波幅", 1.0, 0.01, 30, 0.1),
                pn("wavelengthX", "Wavelength x", "x 方向波长", 8, 0.5, 100, 0.5),
                pn("wavelengthY", "Wavelength y", "y 方向波长", 12, 0.5, 100, 0.5),
                pn("frequency", "Frequency", "频率", 0.25, 0.01, 10, 0.01),
                pn("damping", "Damping", "阻尼", 0.02, 0, 2, 0.01),
                ps("expressionMode", "Wave mode", "波函数模式", "builtin", [
                    { value: "builtin", label: { en: "Built-in wave", zh: "内置波函数" } },
                    { value: "custom", label: { en: "Custom expression", zh: "自定义表达式" } }
                ]),
                pa(
                    "customExpression",
                    "Custom η(x, y, t)",
                    "自定义 η(x, y, t)",
                    "A*Math.sin(2*Math.PI*x/lambdaX + 2*Math.PI*y/lambdaY - omega*t)",
                    "Use variables: x, y, t, A, lambdaX, lambdaY, omega",
                    "可用变量：x, y, t, A, lambdaX, lambdaY, omega"
                )
            ],
            run: runWave
        },

        boundaryLayer: {
            title: { en: "Boundary Layer Theory", zh: "边界层理论" },
            description: {
                en: "Velocity surface over a flat plate with viscosity and inflow speed control.",
                zh: "平板边界层速度曲面，可控制粘度和来流速度。"
            },
            params: [
                ...commonParams("channel", "x / m", "y / m", "u / m s<sup>-1</sup>"),
                group("Boundary Layer Model", "边界层模型"),
                pn("velocity", "Free-stream velocity", "来流速度", 1.0, 0.01, 100, 0.1),
                pn("viscosity", "Kinematic viscosity", "运动粘度", 1.0, 0.001, 100, 0.1),
                pn("plateLength", "Plate length", "平板长度", 4.0, 0.2, 50, 0.1)
            ],
            run: runBoundaryLayer
        },

        turbulenceTheory: {
            title: { en: "Turbulence Theory Simulation", zh: "湍流理论模拟" },
            description: {
                en: "Synthetic vortex field with editable domain, intensity and density.",
                zh: "合成涡旋场，可编辑区域、强度和矢量密度。"
            },
            params: [
                ...commonParams("block", "x / m", "y / m", "z / m"),
                group("Turbulence Model", "湍流模型"),
                pn("intensity", "Turbulence intensity", "湍流强度", 1.0, 0.01, 10, 0.1),
                pn("vectorDensity", "Vector density", "矢量密度", 7, 4, 12, 1),
                pn("swirl", "Swirl coefficient", "涡旋系数", 1.0, 0.01, 5, 0.1)
            ],
            run: runTurbulence
        }
    }
};

/* =========================
   Init
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
    initLanguageButton();
    initModelEvents();
    updateLanguage();

    ["condensed", "electrochemistry", "fluid"].forEach(section => {
        loadSection(section);
        runSection(section);
    });
});

function initLanguageButton() {
    document.getElementById("languageBtn").addEventListener("click", () => {
        currentLanguage = currentLanguage === "en" ? "zh" : "en";
        updateLanguage();

        ["condensed", "electrochemistry", "fluid"].forEach(section => {
            loadSection(section);
            runSection(section);
        });
    });
}

function initModelEvents() {
    ["condensed", "electrochemistry", "fluid"].forEach(section => {
        const select = document.getElementById(models[section].selectId);
        select.addEventListener("change", () => {
            stopAnimation(section);
            loadSection(section);
            runSection(section);
        });
    });
}

function updateLanguage() {
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });

    document.getElementById("languageBtn").textContent =
        currentLanguage === "en" ? "中文" : "English";
}

/* =========================
   UI rendering
   ========================= */

function loadSection(section) {
    const sectionConfig = models[section];
    const modelKey = document.getElementById(sectionConfig.selectId).value;
    const model = sectionConfig[modelKey];

    document.getElementById(sectionConfig.titleId).textContent = model.title[currentLanguage];
    document.getElementById(sectionConfig.descriptionId).textContent = model.description[currentLanguage];

    const container = document.getElementById(sectionConfig.paramsId);
    container.innerHTML = "";

    model.params.forEach(param => {
        if (param.type === "group") {
            const groupDiv = document.createElement("div");
            groupDiv.className = "param-group";
            groupDiv.textContent = param.label[currentLanguage];
            container.appendChild(groupDiv);
            return;
        }

        const item = document.createElement("div");
        item.className = "parameter-item";

        const label = document.createElement("label");
        label.className = "input-label";
        label.setAttribute("for", `${section}_${param.id}`);
        label.textContent = param.label[currentLanguage];

        let input;

        if (param.type === "select") {
            input = document.createElement("select");
            input.className = "input-control";
            input.id = `${section}_${param.id}`;

            param.options.forEach(option => {
                const opt = document.createElement("option");
                opt.value = option.value;
                opt.textContent = option.label[currentLanguage];
                if (option.value === param.value) opt.selected = true;
                input.appendChild(opt);
            });
        } else if (param.type === "textarea") {
            input = document.createElement("textarea");
            input.className = "input-control textarea-control";
            input.id = `${section}_${param.id}`;
            input.value = param.value;
            input.placeholder = param.placeholder[currentLanguage];
            input.rows = 4;
        } else if (param.type === "text") {
            input = document.createElement("input");
            input.className = "input-control";
            input.type = "text";
            input.id = `${section}_${param.id}`;
            input.value = param.value;
            input.placeholder = param.placeholder[currentLanguage];
        } else {
            input = document.createElement("input");
            input.className = "input-control";
            input.type = "number";
            input.id = `${section}_${param.id}`;
            input.value = param.value;
            input.min = param.min;
            input.max = param.max;
            input.step = param.step;
        }

        item.appendChild(label);
        item.appendChild(input);

        if (param.type === "number") {
            const hint = document.createElement("p");
            hint.className = "parameter-hint";
            hint.textContent =
                currentLanguage === "en"
                    ? `Range: ${param.min} – ${param.max}, step ${param.step}`
                    : `范围：${param.min} – ${param.max}，步长 ${param.step}`;
            item.appendChild(hint);
        }

        container.appendChild(item);
    });
}

function getParam(section, id) {
    const element = document.getElementById(`${section}_${id}`);
    if (!element) return null;

    if (element.tagName === "SELECT") return element.value;
    if (element.tagName === "TEXTAREA") return element.value;
    if (element.type === "text") return element.value;

    return Number(element.value);
}

function runSection(section) {
    const sectionConfig = models[section];
    const modelKey = document.getElementById(sectionConfig.selectId).value;
    const model = sectionConfig[modelKey];
    model.run(section);
}

function animateSection(section) {
    stopAnimation(section);

    animationTimers[section] = setInterval(() => {
        animationPhase[section] += 0.22;
        runSection(section);
    }, 230);
}

function stopAnimation(section) {
    if (animationTimers[section]) {
        clearInterval(animationTimers[section]);
        animationTimers[section] = null;
    }
}

function clearSection(section) {
    stopAnimation(section);
    Plotly.purge(models[section].plotId);
    csvData[section] = [];
}

function downloadCSV(section) {
    const data = csvData[section];

    if (!data || data.length === 0) {
        alert(currentLanguage === "en" ? "No data to download." : "没有可下载的数据。");
        return;
    }

    const csvText = data.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvText], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `young_simulation_${section}.csv`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}

function downloadPNG(section) {
    Plotly.downloadImage(models[section].plotId, {
        format: "png",
        filename: `young_simulation_${section}`,
        height: 1200,
        width: 1700,
        scale: 2
    });
}

/* =========================
   Plot style and axis label formatter
   ========================= */

function formatAxisLabel(label) {
    if (!label) return "";

    let text = String(label).trim();

    if (text.includes("<sub>") || text.includes("<sup>")) {
        return text;
    }

    text = text.replace(/([A-Za-zηφρμνωΩΦΨ]+)_\{([^}]+)\}/g, "$1<sub>$2</sub>");
    text = text.replace(/([A-Za-zηφρμνωΩΦΨ]+)_([A-Za-z0-9+\-]+)/g, "$1<sub>$2</sub>");

    text = text.replace(/([A-Za-zÅμνΩηφρ0-9]+)\^\{([^}]+)\}/g, "$1<sup>$2</sup>");
    text = text.replace(/([A-Za-zÅμνΩηφρ0-9]+)\^([+\-]?[A-Za-z0-9]+)/g, "$1<sup>$2</sup>");

    return text;
}

function getAxisLabels(section, xDefault, yDefault, zDefault) {
    const xLabel = getParam(section, "xAxisLabel") || xDefault;
    const yLabel = getParam(section, "yAxisLabel") || yDefault;
    const zLabel = getParam(section, "zAxisLabel") || zDefault;

    return {
        x: formatAxisLabel(xLabel),
        y: formatAxisLabel(yLabel),
        z: formatAxisLabel(zLabel)
    };
}

function cleanAxis(title) {
    return {
        title: {
            text: formatAxisLabel(title),
            font: {
                size: 15,
                family: "Times New Roman, SimSun, serif",
                color: "#1f1f1f"
            }
        },
        showgrid: false,
        zeroline: false,
        showbackground: false,
        showline: true,
        linecolor: "#1f1f1f",
        linewidth: 2,
        ticks: "outside",
        tickfont: {
            family: "Times New Roman, SimSun, serif",
            color: "#1f1f1f",
            size: 13
        }
    };
}

function paperLayout(title, xTitle, yTitle, zTitle) {
    return {
        title: {
            text: title,
            font: {
                size: 21,
                family: "Times New Roman, SimSun, serif",
                color: "#1f1f1f"
            },
            x: 0.5,
            xanchor: "center"
        },
        paper_bgcolor: "#ffffff",
        plot_bgcolor: "#ffffff",
        font: {
            family: "Times New Roman, SimSun, serif",
            color: "#1f1f1f",
            size: 14
        },
        scene: {
            bgcolor: "#ffffff",
            xaxis: cleanAxis(xTitle),
            yaxis: cleanAxis(yTitle),
            zaxis: cleanAxis(zTitle),
            camera: {
                eye: { x: 1.55, y: 1.45, z: 1.12 }
            },
            aspectmode: "cube"
        },
        margin: {
            l: 0,
            r: 0,
            t: 62,
            b: 0
        },
        legend: {
            x: 0.02,
            y: 0.98,
            bgcolor: "rgba(255,255,255,0.82)",
            bordercolor: "#d8d3c8",
            borderwidth: 1,
            font: {
                family: "Times New Roman, SimSun, serif",
                size: 13,
                color: "#1f1f1f"
            }
        }
    };
}

const plotConfig = {
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: [
        "lasso2d",
        "select2d",
        "autoScale2d",
        "hoverClosestCartesian",
        "hoverCompareCartesian"
    ]
};

function linspace(min, max, n) {
    const arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(min + (max - min) * i / Math.max(1, n - 1));
    }
    return arr;
}

function safeEvalExpression(expression, variables, fallback) {
    try {
        const keys = Object.keys(variables);
        const values = Object.values(variables);
        const fn = new Function(...keys, `"use strict"; return (${expression});`);
        const result = fn(...values);

        if (!Number.isFinite(result)) return fallback;
        return result;
    } catch (error) {
        return fallback;
    }
}

function geometryMask(geometry, x, y, z, lx, ly, lz, porosity = 0) {
    const cx = lx / 2;
    const cy = ly / 2;
    const cz = lz / 2;

    if (geometry === "sphere") {
        const r = Math.min(lx, ly, lz) / 2;
        return (x - cx) ** 2 + (y - cy) ** 2 + (z - cz) ** 2 <= r ** 2;
    }

    if (geometry === "cylinder") {
        const r = Math.min(lx, ly) / 2;
        return (x - cx) ** 2 + (y - cy) ** 2 <= r ** 2;
    }

    if (geometry === "film") {
        return z <= lz * 0.35;
    }

    if (geometry === "channel") {
        return y > ly * 0.1 && y < ly * 0.9;
    }

    if (geometry === "porous") {
        const pore =
            Math.sin(6 * Math.PI * x / lx) *
            Math.sin(6 * Math.PI * y / ly) *
            Math.sin(6 * Math.PI * z / lz);
        return pore > porosity - 0.55;
    }

    return true;
}

/* =========================
   Condensed Matter
   ========================= */

function runElectronicStructure(section) {
    const resolution = Math.round(getParam(section, "resolution"));
    const tx = getParam(section, "tx");
    const ty = getParam(section, "ty");
    const epsilon0 = getParam(section, "epsilon0");
    const ax = getParam(section, "ax");
    const ay = getParam(section, "ay");
    const perturbation = getParam(section, "perturbation");
    const mode = getParam(section, "expressionMode");
    const expression = getParam(section, "customExpression");
    const t = animationPhase[section];

    const kx = linspace(-Math.PI / ax, Math.PI / ax, resolution);
    const ky = linspace(-Math.PI / ay, Math.PI / ay, resolution);
    const energy = [];

    for (let j = 0; j < resolution; j++) {
        const row = [];
        for (let i = 0; i < resolution; i++) {
            const fallback =
                epsilon0 -
                2 * tx * Math.cos(kx[i] * ax) -
                2 * ty * Math.cos(ky[j] * ay) +
                perturbation * Math.sin(t) * Math.sin(kx[i] * ax) * Math.sin(ky[j] * ay);

            let e = fallback;

            if (mode === "custom") {
                e = safeEvalExpression(expression, {
                    kx: kx[i],
                    ky: ky[j],
                    t,
                    tx,
                    ty,
                    ax,
                    ay,
                    epsilon0,
                    Math
                }, fallback);
            }

            row.push(e);
        }
        energy.push(row);
    }

    csvData[section] = [["kx", "ky", "energy"]];
    for (let j = 0; j < resolution; j++) {
        for (let i = 0; i < resolution; i++) {
            csvData[section].push([kx[i], ky[j], energy[j][i]]);
        }
    }

    const axis = getAxisLabels(
        section,
        "k<sub>x</sub> / Å<sup>-1</sup>",
        "k<sub>y</sub> / Å<sup>-1</sup>",
        "E / eV"
    );

    Plotly.react(
        models[section].plotId,
        [{
            type: "surface",
            x: kx,
            y: ky,
            z: energy,
            colorscale: "Viridis",
            showscale: true,
            colorbar: { title: "E", thickness: 18, len: 0.72 },
            contours: {
                x: { show: false },
                y: { show: false },
                z: { show: false }
            },
            lighting: {
                ambient: 0.68,
                diffuse: 0.78,
                specular: 0.22,
                roughness: 0.75
            }
        }],
        paperLayout(
            currentLanguage === "en" ? "Electronic Band Surface" : "电子能带曲面",
            axis.x,
            axis.y,
            axis.z
        ),
        plotConfig
    );
}

function runTransport(section) {
    const lx = getParam(section, "lx");
    const ly = getParam(section, "ly");
    const lz = getParam(section, "lz");
    const geometry = getParam(section, "geometry");
    const porosity = getParam(section, "porosity");
    const mobility = getParam(section, "mobility");
    const electricField = getParam(section, "electricField");
    const carrierDensity = getParam(section, "carrierDensity");
    const density = Math.round(getParam(section, "vectorDensity"));
    const perturbation = getParam(section, "perturbation");
    const t = animationPhase[section];

    const x = [], y = [], z = [], u = [], v = [], w = [];

    for (let i = 0; i < density; i++) {
        for (let j = 0; j < density; j++) {
            for (let k = 0; k < density; k++) {
                const xx = lx * i / (density - 1);
                const yy = ly * j / (density - 1);
                const zz = lz * k / (density - 1);

                if (!geometryMask(geometry, xx, yy, zz, lx, ly, lz, porosity)) continue;

                const ux = mobility * carrierDensity * electricField * (1 + perturbation * Math.sin(t + zz));
                const uy = 0.25 * perturbation * Math.sin(2 * Math.PI * yy / ly + t);
                const uz = 0.25 * perturbation * Math.cos(2 * Math.PI * xx / lx + t);

                x.push(xx); y.push(yy); z.push(zz);
                u.push(ux); v.push(uy); w.push(uz);
            }
        }
    }

    csvData[section] = [["x", "y", "z", "Jx", "Jy", "Jz"]];
    for (let i = 0; i < x.length; i++) {
        csvData[section].push([x[i], y[i], z[i], u[i], v[i], w[i]]);
    }

    const axis = getAxisLabels(section, "x / nm", "y / nm", "z / nm");

    Plotly.react(
        models[section].plotId,
        [{
            type: "cone",
            x, y, z, u, v, w,
            colorscale: "Turbo",
            sizemode: "absolute",
            sizeref: Math.max(lx, ly, lz) / 18,
            showscale: true,
            colorbar: { title: "|J|", thickness: 18, len: 0.72 }
        }],
        paperLayout(
            currentLanguage === "en" ? "Current-Density Field" : "电流密度场",
            axis.x,
            axis.y,
            axis.z
        ),
        plotConfig
    );
}

function runCrystal(section) {
    const latticeType = getParam(section, "latticeType");
    const a = getParam(section, "a");
    const b = getParam(section, "b");
    const c = getParam(section, "c");
    const nx = Math.round(getParam(section, "nx"));
    const ny = Math.round(getParam(section, "ny"));
    const nz = Math.round(getParam(section, "nz"));
    const vibration = getParam(section, "vibration");
    const t = animationPhase[section];

    const basisMap = {
        sc: [[0, 0, 0]],
        bcc: [[0, 0, 0], [0.5, 0.5, 0.5]],
        fcc: [[0, 0, 0], [0.5, 0.5, 0], [0.5, 0, 0.5], [0, 0.5, 0.5]]
    };

    const basis = basisMap[latticeType] || basisMap.sc;
    const x = [], y = [], z = [];

    for (let i = 0; i < nx; i++) {
        for (let j = 0; j < ny; j++) {
            for (let k = 0; k < nz; k++) {
                basis.forEach((b0, index) => {
                    const vib = vibration * Math.sin(t + i * 0.7 + j * 0.5 + k * 0.4 + index);
                    x.push((i + b0[0]) * a + vib);
                    y.push((j + b0[1]) * b + 0.6 * vib);
                    z.push((k + b0[2]) * c - 0.4 * vib);
                });
            }
        }
    }

    csvData[section] = [["x", "y", "z"]];
    for (let i = 0; i < x.length; i++) {
        csvData[section].push([x[i], y[i], z[i]]);
    }

    const axis = getAxisLabels(section, "x / Å", "y / Å", "z / Å");

    Plotly.react(
        models[section].plotId,
        [{
            type: "scatter3d",
            mode: "markers",
            x, y, z,
            marker: {
                size: 5.8,
                color: z,
                colorscale: "Viridis",
                opacity: 0.96,
                line: { color: "#111827", width: 0.4 },
                colorbar: { title: "z", thickness: 18, len: 0.72 }
            }
        }],
        paperLayout(
            currentLanguage === "en" ? "Crystal Structure" : "晶体结构",
            axis.x,
            axis.y,
            axis.z
        ),
        plotConfig
    );
}

/* =========================
   Electrochemistry
   ========================= */

function runInterfaceElectrochemistry(section) {
    const lx = getParam(section, "lx");
    const ly = getParam(section, "ly");
    const lz = getParam(section, "lz");
    const geometry = getParam(section, "geometry");
    const porosity = getParam(section, "porosity");
    const phi0 = getParam(section, "phi0");
    const lambdaD = getParam(section, "lambdaD");
    const roughness = getParam(section, "roughness");
    const resolution = Math.round(Math.min(getParam(section, "resolution"), 32));
    const t = animationPhase[section];

    const x = [], y = [], z = [], value = [];

    for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
            for (let k = 0; k < resolution; k++) {
                const xx = lx * i / (resolution - 1);
                const yy = ly * j / (resolution - 1);
                const zz = lz * k / (resolution - 1);

                if (!geometryMask(geometry, xx, yy, zz, lx, ly, lz, porosity)) continue;

                const surface = 1 + roughness * Math.sin(2 * Math.PI * xx / lx + t) * Math.cos(2 * Math.PI * yy / ly);
                const phi = phi0 * Math.exp(-zz / lambdaD) * surface;

                x.push(xx); y.push(yy); z.push(zz); value.push(phi);
            }
        }
    }

    csvData[section] = [["x", "y", "z", "potential"]];
    for (let i = 0; i < x.length; i++) {
        csvData[section].push([x[i], y[i], z[i], value[i]]);
    }

    const axis = getAxisLabels(section, "x / nm", "y / nm", "z / nm");

    Plotly.react(
        models[section].plotId,
        [{
            type: "volume",
            x, y, z, value,
            opacity: 0.18,
            surface: { count: 18 },
            colorscale: "RdBu",
            reversescale: true,
            showscale: true,
            colorbar: { title: "φ", thickness: 18, len: 0.72 }
        }],
        paperLayout(
            currentLanguage === "en" ? "Interfacial Potential Field" : "界面电势场",
            axis.x,
            axis.y,
            axis.z
        ),
        plotConfig
    );
}

function runReactionKinetics(section) {
    const i0 = getParam(section, "i0");
    const alpha = getParam(section, "alpha");
    const etaMax = getParam(section, "etaMax");
    const tMin = getParam(section, "tMin");
    const tMax = getParam(section, "tMax");
    const resolution = Math.round(getParam(section, "resolution"));
    const perturbation = getParam(section, "perturbation");
    const phase = animationPhase[section];

    const F = 96485.33212;
    const R = 8.314462618;

    const eta = linspace(-etaMax, etaMax, resolution);
    const temperature = linspace(tMin, tMax, resolution);
    const current = [];

    for (let j = 0; j < resolution; j++) {
        const row = [];
        for (let i = 0; i < resolution; i++) {
            const dynamic = 1 + perturbation * Math.sin(phase + j * 0.1);
            const e = eta[i];
            const T = temperature[j];

            const val = dynamic * i0 * (
                Math.exp(alpha * F * e / (R * T)) -
                Math.exp(-(1 - alpha) * F * e / (R * T))
            );

            row.push(val);
        }
        current.push(row);
    }

    csvData[section] = [["overpotential", "temperature", "current"]];
    for (let j = 0; j < resolution; j++) {
        for (let i = 0; i < resolution; i++) {
            csvData[section].push([eta[i], temperature[j], current[j][i]]);
        }
    }

    const axis = getAxisLabels(
        section,
        "η / V",
        "T / K",
        "j / A cm<sup>-2</sup>"
    );

    Plotly.react(
        models[section].plotId,
        [{
            type: "surface",
            x: eta,
            y: temperature,
            z: current,
            colorscale: "Plasma",
            showscale: true,
            colorbar: { title: "j", thickness: 18, len: 0.72 },
            contours: {
                x: { show: false },
                y: { show: false },
                z: { show: false }
            }
        }],
        paperLayout(
            currentLanguage === "en" ? "Reaction Kinetic Surface" : "反应动力学曲面",
            axis.x,
            axis.y,
            axis.z
        ),
        plotConfig
    );
}

function runMultiphysicsElectrochemistry(section) {
    const lx = getParam(section, "lx");
    const ly = getParam(section, "ly");
    const lz = getParam(section, "lz");
    const geometry = getParam(section, "geometry");
    const porosity = getParam(section, "porosity");
    const c0 = getParam(section, "c0");
    const reactionStrength = getParam(section, "reactionStrength");
    const diffusionLength = getParam(section, "diffusionLength");
    const resolution = Math.round(Math.min(getParam(section, "resolution"), 32));
    const t = animationPhase[section];

    const x = [], y = [], z = [], value = [];

    const cx = lx / 2;
    const cy = ly / 2;
    const front = diffusionLength * (1 + 0.2 * Math.sin(t));

    for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
            for (let k = 0; k < resolution; k++) {
                const xx = lx * i / (resolution - 1);
                const yy = ly * j / (resolution - 1);
                const zz = lz * k / (resolution - 1);

                if (!geometryMask(geometry, xx, yy, zz, lx, ly, lz, porosity)) continue;

                const r = Math.sqrt((xx - cx) ** 2 + (yy - cy) ** 2 + zz ** 2);
                const c = c0 * (1 - 0.85 * Math.exp(-reactionStrength * r * r / Math.max(1e-6, front * front)));

                x.push(xx); y.push(yy); z.push(zz); value.push(c);
            }
        }
    }

    csvData[section] = [["x", "y", "z", "concentration"]];
    for (let i = 0; i < x.length; i++) {
        csvData[section].push([x[i], y[i], z[i], value[i]]);
    }

    const axis = getAxisLabels(section, "x / μm", "y / μm", "z / μm");

    Plotly.react(
        models[section].plotId,
        [{
            type: "volume",
            x, y, z, value,
            opacity: 0.16,
            surface: { count: 18 },
            colorscale: "Viridis",
            showscale: true,
            colorbar: { title: "c", thickness: 18, len: 0.72 }
        }],
        paperLayout(
            currentLanguage === "en" ? "Concentration Field" : "浓度场",
            axis.x,
            axis.y,
            axis.z
        ),
        plotConfig
    );
}

/* =========================
   Fluid Mechanics
   ========================= */

function runWave(section) {
    const lx = getParam(section, "lx");
    const ly = getParam(section, "ly");
    const geometry = getParam(section, "geometry");
    const resolution = Math.round(getParam(section, "resolution"));
    const A = getParam(section, "amplitude");
    const lambdaX = getParam(section, "wavelengthX");
    const lambdaY = getParam(section, "wavelengthY");
    const frequency = getParam(section, "frequency");
    const damping = getParam(section, "damping");
    const mode = getParam(section, "expressionMode");
    const expression = getParam(section, "customExpression");
    const t = animationPhase[section];

    const omega = 2 * Math.PI * frequency;

    const x = linspace(0, lx, resolution);
    const y = linspace(0, ly, resolution);
    const z = [];

    for (let j = 0; j < resolution; j++) {
        const row = [];
        for (let i = 0; i < resolution; i++) {
            const xx = x[i];
            const yy = y[j];

            let mask = 1;

            if (geometry === "cylinder" || geometry === "sphere") {
                const r = Math.sqrt((xx - lx / 2) ** 2 + (yy - ly / 2) ** 2);
                mask = r <= Math.min(lx, ly) / 2 ? 1 : NaN;
            }

            const attenuation = Math.exp(-damping * Math.sqrt(xx * xx + yy * yy) / Math.max(lx, ly));

            const fallback =
                mask *
                A *
                attenuation *
                Math.sin(2 * Math.PI * xx / lambdaX + 2 * Math.PI * yy / lambdaY - omega * t);

            let eta = fallback;

            if (mode === "custom") {
                eta = mask * safeEvalExpression(expression, {
                    x: xx,
                    y: yy,
                    t,
                    A,
                    lambdaX,
                    lambdaY,
                    omega,
                    Math
                }, fallback);
            }

            row.push(eta);
        }
        z.push(row);
    }

    csvData[section] = [["x", "y", "eta"]];
    for (let j = 0; j < resolution; j++) {
        for (let i = 0; i < resolution; i++) {
            csvData[section].push([x[i], y[j], z[j][i]]);
        }
    }

    const axis = getAxisLabels(
        section,
        "x / m",
        "y / m",
        "η<sub>surface</sub> / m"
    );

    Plotly.react(
        models[section].plotId,
        [{
            type: "surface",
            x,
            y,
            z,
            colorscale: "Blues",
            showscale: true,
            colorbar: { title: "η", thickness: 18, len: 0.72 },
            contours: {
                x: { show: false },
                y: { show: false },
                z: { show: false }
            },
            lighting: {
                ambient: 0.7,
                diffuse: 0.82,
                specular: 0.35,
                roughness: 0.52
            }
        }],
        paperLayout(
            currentLanguage === "en" ? "Free-Surface Wave" : "自由液面波",
            axis.x,
            axis.y,
            axis.z
        ),
        plotConfig
    );
}

function runBoundaryLayer(section) {
    const lx = getParam(section, "plateLength");
    const ly = getParam(section, "ly");
    const U = getParam(section, "velocity");
    const nu = getParam(section, "viscosity") * 1e-6;
    const resolution = Math.round(getParam(section, "resolution"));
    const perturbation = getParam(section, "perturbation");
    const t = animationPhase[section];

    const x = linspace(0.001, lx, resolution);
    const y = linspace(0, ly, resolution);
    const uSurface = [];

    for (let j = 0; j < resolution; j++) {
        const row = [];

        for (let i = 0; i < resolution; i++) {
            const Re = U * x[i] / Math.max(nu, 1e-12);
            const delta = 5 * x[i] / Math.sqrt(Math.max(Re, 1e-9));
            const eta = y[j] / Math.max(delta, 1e-9);

            let u = U * Math.min(1, 1.5 * eta - 0.5 * eta ** 3);
            if (eta > 1) u = U;

            u *= 1 + perturbation * 0.05 * Math.sin(t + 4 * x[i] / lx);

            row.push(u);
        }

        uSurface.push(row);
    }

    csvData[section] = [["x", "y", "velocity"]];
    for (let j = 0; j < resolution; j++) {
        for (let i = 0; i < resolution; i++) {
            csvData[section].push([x[i], y[j], uSurface[j][i]]);
        }
    }

    const axis = getAxisLabels(
        section,
        "x / m",
        "y / m",
        "u / m s<sup>-1</sup>"
    );

    Plotly.react(
        models[section].plotId,
        [{
            type: "surface",
            x,
            y,
            z: uSurface,
            colorscale: "Turbo",
            showscale: true,
            colorbar: { title: "u", thickness: 18, len: 0.72 },
            contours: {
                x: { show: false },
                y: { show: false },
                z: { show: false }
            }
        }],
        paperLayout(
            currentLanguage === "en" ? "Boundary-Layer Velocity Surface" : "边界层速度曲面",
            axis.x,
            axis.y,
            axis.z
        ),
        plotConfig
    );
}

function runTurbulence(section) {
    const lx = getParam(section, "lx");
    const ly = getParam(section, "ly");
    const lz = getParam(section, "lz");
    const geometry = getParam(section, "geometry");
    const porosity = getParam(section, "porosity");
    const intensity = getParam(section, "intensity");
    const density = Math.round(getParam(section, "vectorDensity"));
    const swirl = getParam(section, "swirl");
    const t = animationPhase[section];

    const x = [], y = [], z = [], u = [], v = [], w = [];

    for (let i = 0; i < density; i++) {
        for (let j = 0; j < density; j++) {
            for (let k = 0; k < density; k++) {
                const xx = lx * i / (density - 1);
                const yy = ly * j / (density - 1);
                const zz = lz * k / (density - 1);

                if (!geometryMask(geometry, xx, yy, zz, lx, ly, lz, porosity)) continue;

                const ux =
                    intensity *
                    Math.sin(swirl * 2 * Math.PI * yy / ly + t) *
                    Math.cos(swirl * 2 * Math.PI * zz / lz);

                const vy =
                    intensity *
                    Math.sin(swirl * 2 * Math.PI * zz / lz + t) *
                    Math.cos(swirl * 2 * Math.PI * xx / lx);

                const wz =
                    intensity *
                    Math.sin(swirl * 2 * Math.PI * xx / lx + t) *
                    Math.cos(swirl * 2 * Math.PI * yy / ly);

                x.push(xx); y.push(yy); z.push(zz);
                u.push(ux); v.push(vy); w.push(wz);
            }
        }
    }

    csvData[section] = [["x", "y", "z", "u", "v", "w"]];
    for (let i = 0; i < x.length; i++) {
        csvData[section].push([x[i], y[i], z[i], u[i], v[i], w[i]]);
    }

    const axis = getAxisLabels(section, "x / m", "y / m", "z / m");

    Plotly.react(
        models[section].plotId,
        [{
            type: "cone",
            x, y, z, u, v, w,
            colorscale: "Turbo",
            sizemode: "absolute",
            sizeref: Math.max(lx, ly, lz) / 20,
            showscale: true,
            colorbar: { title: "|u|", thickness: 18, len: 0.72 }
        }],
        paperLayout(
            currentLanguage === "en" ? "Turbulent Vortex Field" : "湍流涡旋场",
            axis.x,
            axis.y,
            axis.z
        ),
        plotConfig
    );
}