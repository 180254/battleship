package pl.nn44.battleship.service.other;

import org.springframework.core.env.Environment;
import pl.nn44.battleship.configuration.GameProperties;
import pl.nn44.battleship.model.Grid;

public class GridFactory {

    public static Grid sizeFromEnv(Environment env, int[] cells) {
        return new Grid(
                env.getProperty("game.grid.size.rows", int.class),
                env.getProperty("game.grid.size.cols", int.class),
                cells
        );
    }

    public static Grid sizeFromEnv(GameProperties env, int[] cells) {
        return new Grid(
                env.getGridSize().getRows(),
                env.getGridSize().getCols(),
                cells
        );
    }
}
