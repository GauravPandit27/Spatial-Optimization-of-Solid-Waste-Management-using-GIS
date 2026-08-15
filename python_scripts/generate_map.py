import geopandas as gpd
from shapely.geometry import Point
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import os
import webbrowser

def create_sample_data():
    """Create sample data for Dustbins, Ghats, and Sector zones (Varanasi coordinates)."""
    crs_wgs84 = "EPSG:4326"
    
    # 1. Mark Points
    dustbins = gpd.GeoDataFrame([
        {'name': 'Bin 1', 'geometry': Point(83.007, 25.305)},
        {'name': 'Bin 2', 'geometry': Point(83.009, 25.307)},
        {'name': 'Bin 3', 'geometry': Point(83.012, 25.306)},
        {'name': 'Bin 4', 'geometry': Point(83.006, 25.302)},
    ], crs=crs_wgs84)

    ghats = gpd.GeoDataFrame([
        {'name': 'Dashashwamedh Ghat', 'geometry': Point(83.010, 25.306)},
        {'name': 'Assi Ghat', 'geometry': Point(83.005, 25.297)},
    ], crs=crs_wgs84)

    sectors = gpd.GeoDataFrame([
        {'name': 'Zone A', 'geometry': Point(83.008, 25.302)},
        {'name': 'Zone B', 'geometry': Point(83.011, 25.308)},
    ], crs=crs_wgs84)
    
    return dustbins, ghats, sectors

def generate_map():
    print("Generating sample data...")
    dustbins, ghats, sectors = create_sample_data()

    # Reproject to a projected CRS (UTM Zone 44N for Varanasi area) to calculate accurate meters
    utm_crs = "EPSG:32644"
    dustbins_utm = dustbins.to_crs(utm_crs)
    ghats_utm = ghats.to_crs(utm_crs)
    sectors_utm = sectors.to_crs(utm_crs)

    print("Step 2: Running 50m Buffer on Dustbins...")
    # 2. Run a Simple Buffer (50m circular radius)
    buffers_utm = dustbins_utm.copy()
    buffers_utm['geometry'] = dustbins_utm.geometry.buffer(50)

    print("Step 3: Exporting Clean Report Maps...")
    # 3. Create the Map Plot
    fig, ax = plt.subplots(figsize=(10, 8))

    # Plot the 50m Buffers (Served Area)
    buffers_utm.plot(ax=ax, color='lightgreen', edgecolor='green', alpha=0.5)

    # Plot the Points
    dustbins_utm.plot(ax=ax, color='red', marker='o', markersize=40)
    ghats_utm.plot(ax=ax, color='blue', marker='^', markersize=100)
    sectors_utm.plot(ax=ax, color='orange', marker='s', markersize=100)

    # Add Title
    plt.title('Waste Management Coverage Analysis\n(50m Dustbin Buffer)', fontsize=16, pad=20)

    # Add Legend
    legend_elements = [
        mpatches.Patch(color='lightgreen', alpha=0.5, label='Served Area (50m Buffer)'),
        plt.Line2D([0], [0], marker='o', color='w', markerfacecolor='red', markersize=10, label='Dustbins'),
        plt.Line2D([0], [0], marker='^', color='w', markerfacecolor='blue', markersize=12, label='Ghats'),
        plt.Line2D([0], [0], marker='s', color='w', markerfacecolor='orange', markersize=12, label='Sector Zones')
    ]
    ax.legend(handles=legend_elements, loc='upper left', frameon=True, title='Legend')

    # Remove axis coordinates for a cleaner "Report Map" look
    ax.set_axis_off()

    # Save exports
    png_path = 'Coverage_Report_Map.png'
    pdf_path = 'Coverage_Report_Map.pdf'
    
    plt.savefig(png_path, dpi=300, bbox_inches='tight')
    plt.savefig(pdf_path, bbox_inches='tight')
    
    print(f"Success! Maps exported to:\n- {os.path.abspath(png_path)}\n- {os.path.abspath(pdf_path)}")

if __name__ == "__main__":
    generate_map()

    # Launch the interactive Project Dashboard UI
    dashboard_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'dashboard', 'index.html'))
    print(f"\nLaunching Interactive Project Dashboard: {dashboard_path}")
    webbrowser.open(f'file:///{dashboard_path}')
